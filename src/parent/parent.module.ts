import { Module } from '@nestjs/common';
import { ParentService } from './parent.service';
import { ParentController } from './parent.controller';
import { RolesModule } from 'src/roles/roles.module';
import { AddressModule } from 'src/address/address.module';
import { SchoolModule } from 'src/school/school.module';
import { UserModule } from 'src/user/user.module';
import { CityModule } from 'src/city/city.module';
import CurrentUser from 'src/utils/CurrentUser';

import {
  User,
  UserSchema,
  Address,
  AddressSchema,
  Parent,
  ParentSchema,
} from 'src/Schemas';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CustomParentSchool,
  CustomParentSchoolSchema,
} from 'src/Schemas/customParentSchool.schema';

@Module({
  controllers: [ParentController],
  providers: [ParentService, CurrentUser],
  imports: [
    MongooseModule.forFeature([{ name: Parent.name, schema: ParentSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
    MongooseModule.forFeature([{ name: Parent.name, schema: ParentSchema }]),
    RolesModule,
    AddressModule,
    UserModule,
    CityModule,
    SchoolModule,
    CurrentUser,
  ],
})
export class ParentModule {}
