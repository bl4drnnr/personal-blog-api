import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { requireEnv } from '@common/env';
import { setupSwagger } from '@common/swagger';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  configureApp(app);
  setupSwagger(app);
  await app.listen(Number(requireEnv('API_PORT')));
}

void bootstrap();
