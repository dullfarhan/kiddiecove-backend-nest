import { Controller, Get, Post } from '@nestjs/common';
import { ExpoPushTokenServiceService } from './expo-push-token-service.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Expo Push Token')
@Controller('expo-push-tken-service')
export class ExpoPushTkenServiceController {
  constructor(
    private readonly expoPushTokenServiceService: ExpoPushTokenServiceService,
  ) {}

  // @Post('/pushToken')
  // addToken() {}
}
