import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { Address, AddressSchema } from 'src/Schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Address.name, schema: AddressSchema },
      // { name: Country.name, schema: CountrySchema },
    ]),
  ],
  controllers: [],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
