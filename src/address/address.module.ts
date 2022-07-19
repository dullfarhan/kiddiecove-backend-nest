import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { Address,AddressSchema } from 'src/Schemas';


@Module({imports: [
    MongooseModule.forFeature([
      { name: Address.name, schema: AddressSchema },
      // { name: Country.name, schema: CountrySchema },
    ]),
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
