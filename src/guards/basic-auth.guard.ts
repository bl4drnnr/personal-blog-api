import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BasicAuthUnauthorizedException } from '@exceptions/auth/basic-auth-unauthorized.exception';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new BasicAuthUnauthorizedException();
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    const expectedUsername = this.configService.get<string>('BASIC_AUTH_USERNAME');
    const expectedPassword = this.configService.get<string>('BASIC_AUTH_PASSWORD');

    if (!expectedUsername || !expectedPassword) {
      throw new BasicAuthUnauthorizedException();
    }

    if (username !== expectedUsername || password !== expectedPassword) {
      throw new BasicAuthUnauthorizedException();
    }

    return true;
  }
}
