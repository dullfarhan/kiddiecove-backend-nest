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
<<<<<<< HEAD
import { SchoolAdminModule } from './school-admin/school-admin.module';
=======
import { ChatModule } from './chat/chat.module';
import { HomeModule } from './home/home.module';
import { StatModule } from './stat/stat.module';
import { SchoolAdminModule } from './school-admin/school-admin.module';
import { AdminModule } from './admin/admin.module';
>>>>>>> 8d3e5aa33368e0c89feb40f5ee584ef3399ae9e1

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
<<<<<<< HEAD
    SchoolAdminModule,
=======
    ChatModule,
    HomeModule,
    StatModule,
    SchoolAdminModule,
    AdminModule,
>>>>>>> 8d3e5aa33368e0c89feb40f5ee584ef3399ae9e1
  ],
  controllers: [AppController],
  providers: [AppService, Database],
})
export class AppModule {}
