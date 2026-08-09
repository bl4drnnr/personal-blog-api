import { eq } from 'drizzle-orm';
import { hashSync } from 'bcryptjs';
import { authenticator } from 'otplib';
import request from 'supertest';
import { users } from '@db/schema';
import { createTestApp, TestApp } from './app.harness';

const EMAIL = 'e2e-auth@test.local';
const PASSWORD = 'correct horse battery staple';
const NEW_PASSWORD = 'an even longer battery staple';

describe('Auth (e2e)', () => {
  let ctx: TestApp;
  let server: ReturnType<TestApp['app']['getHttpServer']>;

  beforeAll(async () => {
    ctx = await createTestApp();
    server = ctx.app.getHttpServer();
    await ctx.db.delete(users).where(eq(users.email, EMAIL));
    await ctx.db.insert(users).values({ email: EMAIL, passwordHash: hashSync(PASSWORD, 10) });
  });

  afterAll(async () => {
    await ctx.db.delete(users).where(eq(users.email, EMAIL));
    await ctx.app.close();
  });

  let tempToken: string;
  let totpSecret: string;
  let accessToken: string;
  let refreshCookie: string;

  const extractRefreshCookie = (res: request.Response): string => {
    const cookies = res.get('Set-Cookie');
    if (!cookies) {
      throw new Error('No Set-Cookie header in response');
    }
    const rt = cookies.find((c: string) => c.startsWith('_rt='));
    if (!rt) {
      throw new Error('No _rt cookie in response');
    }
    return rt;
  };

  it('rejects a wrong password', async () => {
    await request(server)
      .post('/api/auth/login')
      .send({ email: EMAIL, password: 'wrong' })
      .expect(401);
  });

  it('requires MFA enrollment on first login', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ email: EMAIL, password: PASSWORD })
      .expect(200);
    expect(res.body.mfaSetupRequired).toBe(true);
    expect(res.body.tempToken).toBeDefined();
    tempToken = res.body.tempToken;
  });

  it('serves an enrollment QR and otpauth URL', async () => {
    const res = await request(server)
      .get('/api/auth/mfa/setup')
      .set('Authorization', `Bearer ${tempToken}`)
      .expect(200);
    expect(res.body.qrDataUrl).toMatch(/^data:image\/png;base64,/);
    const url = new URL(res.body.otpauthUrl);
    const secret = url.searchParams.get('secret');
    if (!secret) {
      throw new Error('otpauth URL has no secret');
    }
    totpSecret = secret;
  });

  it('rejects a wrong TOTP code on enable', async () => {
    await request(server)
      .post('/api/auth/mfa/enable')
      .set('Authorization', `Bearer ${tempToken}`)
      .send({ code: '000000' })
      .expect(401);
  });

  it('enables MFA and issues tokens with hardened cookie flags', async () => {
    const res = await request(server)
      .post('/api/auth/mfa/enable')
      .set('Authorization', `Bearer ${tempToken}`)
      .send({ code: authenticator.generate(totpSecret) })
      .expect(200);
    expect(res.body.accessToken).toBeDefined();
    accessToken = res.body.accessToken;

    refreshCookie = extractRefreshCookie(res);
    expect(refreshCookie).toContain('HttpOnly');
    expect(refreshCookie).toContain('Secure');
    expect(refreshCookie).toContain('SameSite=Strict');
    expect(refreshCookie).toContain('Path=/api/auth');
  });

  it('guards admin routes against missing/temp tokens', async () => {
    await request(server)
      .put('/api/admin/password')
      .send({ currentPassword: PASSWORD, newPassword: NEW_PASSWORD })
      .expect(401);
    await request(server)
      .put('/api/admin/password')
      .set('Authorization', `Bearer ${tempToken}`)
      .send({ currentPassword: PASSWORD, newPassword: NEW_PASSWORD })
      .expect(401);
  });

  it('changes the password with a valid access token', async () => {
    await request(server)
      .put('/api/admin/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ currentPassword: 'not the password', newPassword: NEW_PASSWORD })
      .expect(401);

    const staleCookie = refreshCookie;
    const changed = await request(server)
      .put('/api/admin/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ currentPassword: PASSWORD, newPassword: NEW_PASSWORD })
      .expect(200);

    // The caller is handed a fresh session so the tab that made the change
    // stays signed in.
    expect(typeof changed.body.accessToken).toBe('string');
    accessToken = changed.body.accessToken;
    refreshCookie = extractRefreshCookie(changed);
    expect(refreshCookie).not.toEqual(staleCookie);

    // Anyone still holding the pre-change refresh token is locked out.
    await request(server).post('/api/auth/refresh').set('Cookie', staleCookie).expect(401);
  });

  it('logs in with the new password and an MFA challenge', async () => {
    const login = await request(server)
      .post('/api/auth/login')
      .send({ email: EMAIL, password: NEW_PASSWORD })
      .expect(200);
    expect(login.body.mfaRequired).toBe(true);

    const verify = await request(server)
      .post('/api/auth/mfa/verify')
      .set('Authorization', `Bearer ${login.body.tempToken}`)
      .send({ code: authenticator.generate(totpSecret) })
      .expect(200);
    accessToken = verify.body.accessToken;
    refreshCookie = extractRefreshCookie(verify);
  });

  it('rotates refresh tokens and kills the session on replay', async () => {
    const oldCookie = refreshCookie;

    const first = await request(server)
      .post('/api/auth/refresh')
      .set('Cookie', oldCookie)
      .expect(200);
    expect(first.body.accessToken).toBeDefined();
    const rotatedCookie = extractRefreshCookie(first);

    // Replaying the rotated-out token must fail and revoke the whole session…
    await request(server).post('/api/auth/refresh').set('Cookie', oldCookie).expect(401);
    // …so even the newest token is now dead.
    await request(server).post('/api/auth/refresh').set('Cookie', rotatedCookie).expect(401);
  });

  it('logout revokes the session', async () => {
    const login = await request(server)
      .post('/api/auth/login')
      .send({ email: EMAIL, password: NEW_PASSWORD })
      .expect(200);
    const verify = await request(server)
      .post('/api/auth/mfa/verify')
      .set('Authorization', `Bearer ${login.body.tempToken}`)
      .send({ code: authenticator.generate(totpSecret) })
      .expect(200);
    const cookie = extractRefreshCookie(verify);

    await request(server)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${verify.body.accessToken}`)
      .expect(204);

    await request(server).post('/api/auth/refresh').set('Cookie', cookie).expect(401);
  });
});
