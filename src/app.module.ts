import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import { Database } from './database';
import { TeacherModule } from './teacher/teacher.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/kiddiecove'),
    DatabaseModule,
    TeacherModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, Database],
})
export class AppModule {}
