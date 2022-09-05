import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as path from 'path';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ParentModule } from './parent/parent.module';
import { AdminModule } from './admin/admin.module';
import { ChatModule } from './chat/chat.module';
import { CityModule } from './city/city.module';
import { ClassModule } from './class/class.module';
import { CountryModule } from './country/country.module';
import { DriverModule } from './driver/driver.module';
import { HomeModule } from './home/home.module';
import { KidModule } from './kid/kid.module';
import { PostModule } from './post/post.module';
import { RolesModule } from './roles/roles.module';
import { SchoolModule } from './school/school.module';
import { SchoolAdminModule } from './school-admin/school-admin.module';
import { StatModule } from './stat/stat.module';
import { TeacherModule } from './teacher/teacher.module';
import { UserModule } from './user/user.module';
import { PermissionModule } from './permission/permission.module';
import { EndpointModule } from './endpoint/endpoint.module';
import { AuthModule } from './auth/auth.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());

  app.setBaseViewsDir(path.join(__dirname, '..', 'src/views'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('pug');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors();
  app.setGlobalPrefix('api');
  createParentSwagger(app);
  createSwagger(app, 'teacher', TeacherModule);
  createSwagger(app, 'roles', RolesModule);
  createSwagger(app, 'permission', PermissionModule);
  createSwagger(app, 'endpoint', EndpointModule);
  createSwagger(app, 'city', CityModule);
  createSwagger(app, 'school', SchoolModule);
  createSwagger(app, 'school-admin', SchoolAdminModule);
  createSwagger(app, 'user', UserModule);
  createSwagger(app, 'parent', ParentModule);
  createSwagger(app, 'kid', KidModule);
  createSwagger(app, 'class', ClassModule);
  createSwagger(app, 'auth', AuthModule);
  createSwagger(app, 'driver', DriverModule);
  createSwagger(app, 'chat', ChatModule);
  createSwagger(app, 'home', HomeModule);
  createSwagger(app, 'stats', StatModule);
  createSwagger(app, 'admin', AdminModule);
  createSwagger(app, 'country', CountryModule);
  createSwagger(app, 'post', PostModule);

  await app.listen(5000);

  console.log('Listening on Port: 5000');
}
bootstrap();

function createSwagger(
  app: NestExpressApplication,
  name: string,
  includeModule,
) {
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
  const document = SwaggerModule.createDocument(app, config, {
    include: [includeModule],
  });
  SwaggerModule.setup(name, app, document);
}

function createParentSwagger(app: NestExpressApplication) {
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
}
