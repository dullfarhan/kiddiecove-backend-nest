import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { Address, AddressSchema } from 'src/Schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
  ],
  exports: [AddressService],
})
export class AddressModule {}
