import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Address,
  AddressSchema,
  Admin,
  AdminSchema,
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
      { name: Admin.name, schema: AdminSchema },
      { name: Address.name, schema: AddressSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AddressModule,
    CityModule,
    UserModule,
    RolesModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
