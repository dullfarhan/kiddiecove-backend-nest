import { Module } from '@nestjs/common';
import { TrackingServiceService } from './tracking-service.service';
import { TrackingServiceController } from './tracking-service.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TrackingServiceController],
  providers: [TrackingServiceService],
})
export class TrackingServiceModule {}
