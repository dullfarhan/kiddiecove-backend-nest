import { Module } from '@nestjs/common';
import { ExpoPushTokenServiceService } from './expo-push-token-service.service';
import { ExpoPushTkenServiceController } from './expo-push-token-service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/Schemas';

@Module({
  controllers: [ExpoPushTkenServiceController],
  providers: [ExpoPushTokenServiceService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class ExpoPushTokenServiceModule {}
