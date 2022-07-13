import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { Connection } from 'mongoose';
import EventEmitter from 'events';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  // Setting Templeting Engine
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useStaticAssets(join(__dirname, '..', 'public'));

  const config = new DocumentBuilder()
    .setTitle('KiddieCove-nestjs')
    .setDescription('The kiddiecove API description')
    .setVersion('1.0')
    .addTag('kiddiecove')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);

  console.log('Listening on Port: 3000');
}
bootstrap();
