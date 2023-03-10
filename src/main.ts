import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';

(async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  const port = process.env.API_PORT;

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET
  });

  app.setGlobalPrefix('/api');

  await app.listen(port, '0.0.0.0', () => {
    console.log(`Application has been started on port ${port}`);
  });
})();
