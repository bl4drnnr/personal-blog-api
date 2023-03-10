import {
  Injectable,
  NestMiddleware,
  UnauthorizedException
} from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class SignUpMiddleware implements NestMiddleware {
  constructor(private configService: ApiConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['registration-authorization']) {
      const authorization = req.headers['registration-authorization'] as string;
      const basic = authorization.match(/^Basic (.+)$/);

      if (!basic) throw new UnauthorizedException();

      const credentials = Buffer.from(basic[1], 'base64').toString('utf-8');

      const signUpUsername =
        this.configService.signUpAuthConfig.signup_username;
      const signUpPassword =
        this.configService.signUpAuthConfig.signup_password;

      if (credentials != `${signUpUsername}:${signUpPassword}`) {
        throw new UnauthorizedException();
      }

      return next();
    }
    throw new UnauthorizedException();
  }
}
