import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { Connection } from 'mongoose';
import EventEmitter from 'events';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  // Setting Templeting Engine
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(3001);
}
bootstrap();
