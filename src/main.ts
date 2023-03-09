import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule);
  const port = process.env.API_PORT;

  app.setGlobalPrefix('/api');

  await app.listen(port, () => {
    console.log(`Application has been started on port ${port}`);
  });
})();
