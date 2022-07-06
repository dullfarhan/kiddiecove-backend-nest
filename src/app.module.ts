import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomAuthorizationFilter } from './Middlewares/custom-authorization-filter.middleware';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/kiddiecove')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomAuthorizationFilter).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
