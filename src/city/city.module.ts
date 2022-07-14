import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { City, CitySchema, Country, CountrySchema } from 'src/Schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: City.name, schema: CitySchema },
      { name: Country.name, schema: CountrySchema },
    ]),
  ],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
