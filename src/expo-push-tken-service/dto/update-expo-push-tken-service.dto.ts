import { PartialType } from '@nestjs/swagger';
import { CreateExpoPushTkenServiceDto } from './create-expo-push-tken-service.dto';

export class UpdateExpoPushTkenServiceDto extends PartialType(CreateExpoPushTkenServiceDto) {}
