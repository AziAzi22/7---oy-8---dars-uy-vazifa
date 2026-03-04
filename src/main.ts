import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json());
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, '0.0.0.0');
}

bootstrap();
