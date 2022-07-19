import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { School, SchoolSchema } from 'src/Schemas';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService],
  imports: [
    MongooseModule.forFeature([{ name: School.name, schema: SchoolSchema }]),
  ],
  exports: [SchoolService],
})
export class SchoolModule {}
