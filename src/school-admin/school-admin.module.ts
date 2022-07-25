import { Module } from '@nestjs/common';
import { SchoolAdminService } from './school-admin.service';
import { SchoolAdminController } from './school-admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Address,
  AddressSchema,
  SchoolAdmin,
  SchoolAdminSchema,
  User,
  UserSchema,
} from 'src/Schemas';
import { AddressModule } from 'src/address/address.module';
import { CityModule } from 'src/city/city.module';
import { UserModule } from 'src/user/user.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SchoolAdmin.name, schema: SchoolAdminSchema },
      { name: User.name, schema: UserSchema },
      { name: Address.name, schema: AddressSchema },
    ]),
    AddressModule,
    CityModule,
    UserModule,
    RolesModule,
  ],
  controllers: [SchoolAdminController],
  providers: [SchoolAdminService],
  exports: [SchoolAdminService],
})
export class SchoolAdminModule {}
