import { Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { TrackingServiceService } from './tracking-service.service';

@ApiTags('Tracking Service')
@Controller('tracking-service')
export class TrackingServiceController {
  constructor(private readonly trackingService: TrackingServiceService) {}

  // @Post('/tracking')
  // trackChild(@Res() res: Response) {
  //   return this.trackingService.trackChild(res);
  // }
}
