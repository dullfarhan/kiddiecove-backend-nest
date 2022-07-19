import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressModule } from 'src/address/address.module';
import { CityModule } from 'src/city/city.module';
import {
  Address,
  AddressSchema,
  Driver,
  DriverSchema,
  SchoolAdmin,
  SchoolAdminSchema,
  User,
  UserSchema,
} from 'src/Schemas';
import { SchoolModule } from 'src/school/school.module';
import { UserModule } from 'src/user/user.module';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';

@Module({
  controllers: [DriverController],
  providers: [DriverService],
  imports: [
    MongooseModule.forFeature([
      { name: Driver.name, schema: DriverSchema },
      { name: User.name, schema: UserSchema },
      { name: SchoolAdmin.name, schema: SchoolAdminSchema },
      { name: Address.name, schema: AddressSchema },
    ]),
    CityModule,
    SchoolModule,
    AddressModule,
    UserModule,
  ],
})
export class DriverModule {}
