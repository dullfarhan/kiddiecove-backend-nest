import { Module } from '@nestjs/common';
import { SchoolAdminService } from './school-admin.service';
import { SchoolAdminController } from './school-admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SchoolAdmin, SchoolAdminSchema } from 'src/Schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SchoolAdmin.name, schema: SchoolAdminSchema },
    ]),
  ],
  controllers: [SchoolAdminController],
  providers: [SchoolAdminService],
  exports: [SchoolAdminService],
})
export class SchoolAdminModule {}
