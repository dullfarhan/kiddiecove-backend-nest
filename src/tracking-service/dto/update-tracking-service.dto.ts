import { PartialType } from '@nestjs/swagger';
import { CreateTrackingServiceDto } from './create-tracking-service.dto';

export class UpdateTrackingServiceDto extends PartialType(CreateTrackingServiceDto) {}
