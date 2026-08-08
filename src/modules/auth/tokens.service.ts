import { createHash, randomUUID } from 'crypto';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import { Response } from 'express';
import { durationToMs } from '../../common/duration';
import { Database, DRIZZLE } from '../../db/db.module';
import { sessions } from '../../db/schema';

export const REFRESH_COOKIE = '_rt';
const REFRESH_COOKIE_PATH = '/api/auth';

export interface IssuedTokens {
  accessToken: string;
}

@Injectable()
export class TokensService {
  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Issues a fresh access token and rotates the refresh token: the new jti hash
   * overwrites the user's single session row, so any previously issued refresh
   * token stops working immediately.
   */
  async issueTokens(userId: string, response: Response): Promise<IssuedTokens> {
    const accessTtlMs = durationToMs(this.config.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN'));
    const accessToken = await this.jwt.signAsync(
      { sub: userId, type: 'access' },
      { expiresIn: accessTtlMs / 1000 },
    );

    const refreshTtlMs = durationToMs(this.config.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN'));
    const jti = randomUUID();
    const refreshToken = await this.jwt.signAsync(
      { sub: userId, type: 'refresh', jti },
      { expiresIn: refreshTtlMs / 1000 },
    );

    const expiresAt = new Date(Date.now() + refreshTtlMs);
    await this.db
      .insert(sessions)
      .values({ userId, refreshJtiHash: this.hash(jti), expiresAt })
      .onConflictDoUpdate({
        target: sessions.userId,
        set: { refreshJtiHash: this.hash(jti), expiresAt, updatedAt: new Date() },
      });

    response.cookie(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: REFRESH_COOKIE_PATH,
      maxAge: refreshTtlMs,
    });

    return { accessToken };
  }

  /**
   * Validates a refresh token against the stored session. A structurally valid
   * token whose jti does not match the current session is treated as replay of
   * a rotated-out token — the whole session is revoked.
   */
  async verifyRefreshToken(token: string): Promise<string> {
    let payload: { sub: string; type: string; jti: string };
    try {
      payload = await this.jwt.verifyAsync(token);
    } catch {
      throw new UnauthorizedException();
    }
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException();
    }

    const [session] = await this.db.select().from(sessions).where(eq(sessions.userId, payload.sub));
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException();
    }
    if (session.refreshJtiHash !== this.hash(payload.jti)) {
      await this.db.delete(sessions).where(eq(sessions.userId, payload.sub));
      throw new UnauthorizedException();
    }

    return payload.sub;
  }

  async revokeSession(userId: string, response: Response): Promise<void> {
    await this.db.delete(sessions).where(eq(sessions.userId, userId));
    response.clearCookie(REFRESH_COOKIE, { path: REFRESH_COOKIE_PATH });
  }

  private hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }
}
