import { forwardRef, Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TeacherSchema,
  Teacher,
  Address,
  UserSchema,
  User,
  AddressSchema,
} from 'src/Schemas';
import { CurrentuserModule } from 'src/currentuser/currentuser.module';
import { AddressModule } from 'src/address/address.module';
import { CityModule } from 'src/city/city.module';
import { RolesModule } from 'src/roles/roles.module';
import { SchoolModule } from 'src/school/school.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }]),
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AddressModule,
    RolesModule,
    CityModule,
    forwardRef(() => SchoolModule),
    UserModule,
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}
