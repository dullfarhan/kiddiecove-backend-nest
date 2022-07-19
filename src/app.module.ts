import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import { Database } from './database';
import { TeacherModule } from './teacher/teacher.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CityModule } from './city/city.module';
import { DriverModule } from './driver/driver.module';
import { AddressModule } from './address/address.module';
import { RolesModule } from './roles/roles.module';
import { EndpointModule } from './endpoint/endpoint.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/kiddiecove'),
    DatabaseModule,
    TeacherModule,
    AuthModule,
    UserModule,
    CityModule,
    DriverModule,
    AddressModule,
    RolesModule,
    EndpointModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService, Database],
})
export class AppModule {}
