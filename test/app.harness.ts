import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { Database, DRIZZLE } from '../src/db/db.module';

export interface TestApp {
  app: NestExpressApplication;
  db: Database;
}

/** Boots the real AppModule with the exact production middleware/pipe setup. */
export async function createTestApp(): Promise<TestApp> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication<NestExpressApplication>();
  configureApp(app);
  await app.init();
  return { app, db: app.get<Database>(DRIZZLE) };
}
