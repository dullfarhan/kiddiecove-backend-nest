import { forwardRef, Module } from '@nestjs/common';
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
  User,
  UserSchema,
} from 'src/Schemas';
import { SchoolAdminModule } from 'src/school-admin/school-admin.module';
import { CityModule } from 'src/city/city.module';
import { RolesModule } from 'src/roles/roles.module';
import { UserModule } from 'src/user/user.module';
import { AddressModule } from 'src/address/address.module';
import { ParentModule } from 'src/parent/parent.module';
import { KidModule } from 'src/kid/kid.module';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService],
  imports: [
    MongooseModule.forFeature([
      { name: School.name, schema: SchoolSchema },
      { name: Parent.name, schema: ParentSchema },
      { name: Address.name, schema: AddressSchema },
      { name: User.name, schema: UserSchema },
    ]),
    forwardRef(() => SchoolAdminModule),
    CityModule,
    RolesModule,
    UserModule,
    forwardRef(() => ParentModule),
    AddressModule,
    forwardRef(() => KidModule),
  ],
  exports: [SchoolService],
})
export class SchoolModule {}
