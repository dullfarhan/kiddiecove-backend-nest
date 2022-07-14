import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Driver,
  DriverSchema,
  SchoolAdmin,
  SchoolAdminSchema,
  User,
  UserSchema,
} from 'src/Schemas';
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
    ]),
  ],
})
export class DriverModule {}
