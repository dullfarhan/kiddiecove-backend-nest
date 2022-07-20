import { Module } from '@nestjs/common';
import { EndpointService } from './endpoint.service';
import { EndpointController } from './endpoint.controller';
import { EndPointSchema, EndPoint } from 'src/Schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [EndpointService],
  imports: [
    MongooseModule.forFeature([
      { name: EndPoint.name, schema: EndPointSchema },
    ]),
  ],
  controllers: [EndpointController],
  exports: [EndpointService],
})
export class EndpointModule {}
