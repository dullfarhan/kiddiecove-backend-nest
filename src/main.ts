import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { Connection } from 'mongoose';
import EventEmitter from 'events';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  // Setting Templeting Engine
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(3000);

  console.log('Listening on Port: 3000');
}
bootstrap();
