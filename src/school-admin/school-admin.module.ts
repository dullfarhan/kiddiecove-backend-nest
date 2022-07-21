import { Module } from '@nestjs/common';
import { SchoolAdminService } from './school-admin.service';
import { SchoolAdminController } from './school-admin.controller';
import { CityModule } from 'src/city/city.module';
import { UserModule } from 'src/user/user.module';
import { RolesModule } from 'src/roles/roles.module';
import { AddressModule } from 'src/address/address.module';

import {
  AddressSchema,
  Address,
  UserSchema,
  User,
  SchoolAdminSchema,
  SchoolAdmin,
} from 'src/Schemas';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  controllers: [SchoolAdminController],
  providers: [SchoolAdminService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: SchoolAdmin.name, schema: SchoolAdminSchema },
      { name: Address.name, schema: AddressSchema },
    ]),
    CityModule,
    UserModule,
    AddressModule,
    RolesModule,
  ],
})
export class SchoolAdminModule {}
