import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  School,
  SchoolSchema,
  Parent,
  ParentSchema,
  Address,
  AddressSchema,
} from 'src/Schemas';
import { SchoolAdminModule } from 'src/school-admin/school-admin.module';
import { CityModule } from 'src/city/city.module';
import { RolesModule } from 'src/roles/roles.module';
import { UserModule } from 'src/user/user.module';
import { AddressModule } from 'src/address/address.module';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService],
  imports: [
    MongooseModule.forFeature([{ name: School.name, schema: SchoolSchema }]),
    MongooseModule.forFeature([{ name: Parent.name, schema: ParentSchema }]),
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),

    SchoolAdminModule,
    CityModule,
    RolesModule,
    UserModule,
    AddressModule,
  ],
  exports: [SchoolService],
})
export class SchoolModule {}
