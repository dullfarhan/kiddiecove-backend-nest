import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import { TeacherModule } from './teacher/teacher.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CityModule } from './city/city.module';
import { DriverModule } from './driver/driver.module';
import { AddressModule } from './address/address.module';
import { RolesModule } from './roles/roles.module';
import { EndpointModule } from './endpoint/endpoint.module';
import { PermissionModule } from './permission/permission.module';
import { SchoolAdminModule } from './school-admin/school-admin.module';
import { ChatModule } from './chat/chat.module';
import { HomeModule } from './home/home.module';
import { StatModule } from './stat/stat.module';
import { AdminModule } from './admin/admin.module';
import { ParentModule } from './parent/parent.module';
import { ClassModule } from './class/class.module';
import { CountryModule } from './country/country.module';
import { PostModule } from './post/post.module';
import { CurrentuserModule } from './currentuser/currentuser.module';

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
    ChatModule,
    HomeModule,
    StatModule,
    AdminModule,
    ParentModule,
    ClassModule,
    CountryModule,
    PostModule,
    SchoolAdminModule,
    CurrentuserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
