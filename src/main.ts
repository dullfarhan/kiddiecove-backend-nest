import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as path from 'path';
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
  app.setBaseViewsDir(path.join(__dirname, '..', 'src/views'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('pug');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  // app.useStaticAssets(join(__dirname, '..', 'public'));
  app.enableCors({ origin: 'http://localhost:3000' });
  app.setGlobalPrefix('api');
  // app.set('views', path.join(__dirname, 'views'));
  // app.set('view engine', 'pug');
  const config = new DocumentBuilder()
    .addSecurity('basic', {
      type: 'http',
      scheme: 'basic',
    })
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
    })
    .setTitle('KiddieCove-nestjs')
    .setDescription('The kiddiecove API description')
    .setVersion('1.0')
    .addTag('kiddiecove')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(5000);

  console.log('Listening on Port: 5000');
}
bootstrap();
