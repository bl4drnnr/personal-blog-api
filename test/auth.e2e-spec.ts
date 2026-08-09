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

  it('serves an enrollment QR, otpauth URL and the key as text', async () => {
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
    // Password managers enrol from the text key, so it has to be the same
    // credential the QR encodes — not a second one.
    expect(res.body.secret).toBe(secret);
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

  it('survives two tabs refreshing with the same cookie at once', async () => {
    const shared = refreshCookie;

    // Browser tabs share one cookie jar, so this is what a second tab opening
    // looks like: the same refresh token presented twice, concurrently.
    const [a, b] = await Promise.all([
      request(server).post('/api/auth/refresh').set('Cookie', shared),
      request(server).post('/api/auth/refresh').set('Cookie', shared),
    ]);

    expect([a.status, b.status]).toEqual([200, 200]);
    expect(a.body.accessToken).toBeDefined();
    expect(b.body.accessToken).toBeDefined();

    // Exactly one of them rotates. The other is served from the grace slot and
    // must not re-issue a cookie, or it would clobber the winner's.
    const rotations = [a, b].filter((res) => res.get('Set-Cookie')?.some((c) => c.startsWith('_rt=')));
    expect(rotations).toHaveLength(1);

    // The session is still usable afterwards — the whole point. That call
    // rotates again, so carry its cookie forward rather than the one it retired.
    const stillAlive = await request(server)
      .post('/api/auth/refresh')
      .set('Cookie', extractRefreshCookie(rotations[0]))
      .expect(200);
    refreshCookie = extractRefreshCookie(stillAlive);
  });

  it('kills the session when a token older than the grace slot is replayed', async () => {
    const stale = refreshCookie;

    // Two rotations, so `stale` is neither the current token nor the one the
    // grace slot holds. At that point it can only be a replay.
    const first = await request(server).post('/api/auth/refresh').set('Cookie', stale).expect(200);
    const second = await request(server)
      .post('/api/auth/refresh')
      .set('Cookie', extractRefreshCookie(first))
      .expect(200);
    const newest = extractRefreshCookie(second);

    await request(server).post('/api/auth/refresh').set('Cookie', stale).expect(401);
    // Revocation is total: even the newest token dies with the session.
    await request(server).post('/api/auth/refresh').set('Cookie', newest).expect(401);
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
