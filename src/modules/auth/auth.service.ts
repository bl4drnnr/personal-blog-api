import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { Response } from 'express';
import { Database, DRIZZLE } from '@db/db.module';
import { users } from '@db/schema';
import { MfaService } from './mfa.service';
import { TempTokenPurpose } from './temp-token.guard';
import { TokensService } from './tokens.service';

const TEMP_TOKEN_TTL_SECONDS = 300;
const PASSWORD_HASH_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly jwt: JwtService,
    private readonly tokens: TokensService,
    private readonly mfa: MfaService,
  ) {}

  async login(email: string, password: string) {
    const [user] = await this.db.select().from(users).where(eq(users.email, email));
    if (!user || !(await compare(password, user.passwordHash))) {
      throw new UnauthorizedException();
    }

    const purpose: TempTokenPurpose = user.mfaEnabled ? 'mfa' : 'mfa-setup';
    const tempToken = await this.jwt.signAsync(
      { sub: user.id, type: purpose },
      { expiresIn: TEMP_TOKEN_TTL_SECONDS },
    );

    return user.mfaEnabled
      ? { mfaRequired: true, tempToken }
      : { mfaSetupRequired: true, tempToken };
  }

  async startMfaEnrollment(userId: string, purpose: TempTokenPurpose) {
    if (purpose !== 'mfa-setup') {
      throw new ForbiddenException();
    }
    const user = await this.getUser(userId);
    if (user.mfaEnabled) {
      throw new ConflictException('MFA is already enabled');
    }

    const secret = this.mfa.generateSecret();
    await this.db
      .update(users)
      .set({ mfaSecret: secret, updatedAt: new Date() })
      .where(eq(users.id, userId));

    return this.mfa.buildEnrollment(user.email, secret);
  }

  async enableMfa(userId: string, purpose: TempTokenPurpose, code: string, response: Response) {
    if (purpose !== 'mfa-setup') {
      throw new ForbiddenException();
    }
    const user = await this.getUser(userId);
    if (user.mfaEnabled) {
      throw new ConflictException('MFA is already enabled');
    }
    if (!user.mfaSecret || !this.mfa.verify(code, user.mfaSecret)) {
      throw new UnauthorizedException('Invalid code');
    }

    await this.db
      .update(users)
      .set({ mfaEnabled: true, updatedAt: new Date() })
      .where(eq(users.id, userId));

    return this.tokens.issueTokens(userId, response);
  }

  async verifyMfa(userId: string, purpose: TempTokenPurpose, code: string, response: Response) {
    if (purpose !== 'mfa') {
      throw new ForbiddenException();
    }
    const user = await this.getUser(userId);
    if (!user.mfaEnabled || !user.mfaSecret || !this.mfa.verify(code, user.mfaSecret)) {
      throw new UnauthorizedException('Invalid code');
    }

    return this.tokens.issueTokens(userId, response);
  }

  async refresh(refreshToken: string | undefined, response: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const userId = await this.tokens.verifyRefreshToken(refreshToken);
    return this.tokens.issueTokens(userId, response);
  }

  async logout(userId: string, response: Response) {
    await this.tokens.revokeSession(userId, response);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.getUser(userId);
    if (!(await compare(currentPassword, user.passwordHash))) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    await this.db
      .update(users)
      .set({ passwordHash: await hash(newPassword, PASSWORD_HASH_ROUNDS), updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  private async getUser(userId: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
