import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export type TempTokenPurpose = 'mfa' | 'mfa-setup';

export interface TempTokenRequest extends Request {
  userId: string;
  tokenPurpose: TempTokenPurpose;
}

/**
 * Guards the intermediate login steps: after password verification the client
 * holds a short-lived token whose purpose is either completing MFA enrollment
 * ('mfa-setup') or answering an MFA challenge ('mfa').
 */
@Injectable()
export class TempTokenGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<TempTokenRequest>();
    const header = request.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; type: string }>(
        header.slice('Bearer '.length),
      );
      if (payload.type !== 'mfa' && payload.type !== 'mfa-setup') {
        throw new UnauthorizedException();
      }
      request.userId = payload.sub;
      request.tokenPurpose = payload.type;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
