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
import { DatabaseModule } from './database/database.module';
import { Database } from './database';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/kiddiecove'),
    DatabaseModule,
    TeacherModule,
  ],
  controllers: [AppController],
  providers: [AppService, Database],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomAuthorizationFilter).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
