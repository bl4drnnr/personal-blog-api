import { createHash, randomUUID } from 'crypto';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { eq, sql } from 'drizzle-orm';
import { Response } from 'express';
import { durationToMs } from '@common/duration';
import { Database, DRIZZLE } from '@db/db.module';
import { sessions } from '@db/schema';

export const REFRESH_COOKIE = '_rt';
const REFRESH_COOKIE_PATH = '/api/auth';

/**
 * How long a just-rotated refresh token keeps working.
 *
 * Tabs share one cookie jar, so two of them can send the same refresh token
 * within milliseconds of each other — on a second tab opening, say. Exactly one
 * wins the rotation; without a grace period the other is indistinguishable from
 * a replayed token and revokes the session out from under every tab.
 *
 * The window is deliberately short. Replay detection still fires for anything
 * older, which is the property that makes a stolen refresh token useless.
 */
const ROTATION_GRACE_MS = 30_000;

export interface IssuedTokens {
  accessToken: string;
}

/** Which token the caller presented, and therefore what is owed in response. */
export type RefreshOutcome =
  | { userId: string; withinGrace: false }
  | { userId: string; withinGrace: true };

@Injectable()
export class TokensService {
  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signAccessToken(userId: string): Promise<string> {
    const accessTtlMs = durationToMs(this.config.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN'));
    return this.jwt.signAsync({ sub: userId, type: 'access' }, { expiresIn: accessTtlMs / 1000 });
  }

  /**
   * Starts a session from scratch — login, MFA, password change. Any refresh
   * token issued earlier stops working at once, including whatever sat in the
   * grace slot, which is what makes a sign-in elsewhere evict this browser.
   */
  async issueTokens(userId: string, response: Response): Promise<IssuedTokens> {
    const minted = await this.mint(userId, response);
    await this.db
      .insert(sessions)
      .values({ userId, refreshJtiHash: minted.jtiHash, expiresAt: minted.expiresAt })
      .onConflictDoUpdate({
        target: sessions.userId,
        set: {
          refreshJtiHash: minted.jtiHash,
          expiresAt: minted.expiresAt,
          previousJtiHash: null,
          previousExpiresAt: null,
          updatedAt: new Date(),
        },
      });
    return { accessToken: minted.accessToken };
  }

  /**
   * Rotates during a refresh, demoting the outgoing jti to the grace slot so a
   * second tab racing this one is not mistaken for an attacker.
   *
   * A plain UPDATE rather than an upsert: the row is known to exist by now
   * (verifyRefreshToken just read it), and Postgres evaluates the right-hand
   * side against the pre-update row, so the demotion and the replacement are
   * one statement that concurrent rotations cannot interleave.
   */
  async rotateTokens(userId: string, response: Response): Promise<IssuedTokens> {
    const minted = await this.mint(userId, response);
    await this.db
      .update(sessions)
      .set({
        refreshJtiHash: minted.jtiHash,
        previousJtiHash: sql`${sessions.refreshJtiHash}`,
        previousExpiresAt: new Date(Date.now() + ROTATION_GRACE_MS),
        expiresAt: minted.expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(sessions.userId, userId));
    return { accessToken: minted.accessToken };
  }

  /** Signs both tokens and sets the refresh cookie; the caller stores the hash. */
  private async mint(userId: string, response: Response) {
    const accessToken = await this.signAccessToken(userId);

    const refreshTtlMs = durationToMs(this.config.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN'));
    const jti = randomUUID();
    const refreshToken = await this.jwt.signAsync(
      { sub: userId, type: 'refresh', jti },
      { expiresIn: refreshTtlMs / 1000 },
    );

    response.cookie(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: REFRESH_COOKIE_PATH,
      maxAge: refreshTtlMs,
    });

    return {
      accessToken,
      jtiHash: this.hash(jti),
      expiresAt: new Date(Date.now() + refreshTtlMs),
    };
  }

  /**
   * Validates a refresh token against the stored session. The current jti
   * rotates; the one it replaced is accepted without rotating for a few seconds
   * more. Anything else is a replay of a token that is properly dead, and
   * revokes the session.
   */
  async verifyRefreshToken(token: string): Promise<RefreshOutcome> {
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

    const presented = this.hash(payload.jti);
    if (session.refreshJtiHash === presented) {
      return { userId: payload.sub, withinGrace: false };
    }
    if (
      session.previousJtiHash === presented &&
      session.previousExpiresAt !== null &&
      session.previousExpiresAt > new Date()
    ) {
      return { userId: payload.sub, withinGrace: true };
    }

    await this.db.delete(sessions).where(eq(sessions.userId, payload.sub));
    throw new UnauthorizedException();
  }

  async revokeSession(userId: string, response: Response): Promise<void> {
    await this.db.delete(sessions).where(eq(sessions.userId, userId));
    response.clearCookie(REFRESH_COOKIE, { path: REFRESH_COOKIE_PATH });
  }

  private hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }
}
