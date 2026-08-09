import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { requireEnv } from '@common/env';

/** Shared between main.ts and the e2e test harness so both run the same app. */
export function configureApp(app: NestExpressApplication): void {
  app.setGlobalPrefix('api');
  // Exactly one proxy sits in front of the API (nginx), and it sets
  // X-Forwarded-For to $proxy_add_x_forwarded_for — appending the peer address
  // to whatever the client sent. Trusting one hop makes req.ip the address
  // nginx appended, so a client-supplied X-Forwarded-For cannot forge it.
  // Without this every request looks like it comes from the nginx container and
  // the whole internet shares one rate-limit bucket.
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cookieParser());
  app.useBodyParser('json', { limit: '2mb' });
  app.enableCors({
    origin: requireEnv('CORS_ORIGINS').split(','),
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.disable('x-powered-by');
}
