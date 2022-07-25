import { Module } from '@nestjs/common';
import { StatService } from './stat.service';
import { StatController } from './stat.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Parent,
  ParentSchema,
  School,
  SchoolAdmin,
  SchoolAdminSchema,
  SchoolSchema,
  Teacher,
  TeacherSchema,
  User,
  UserSchema,
} from 'src/Schemas';
import { SchoolAdminModule } from 'src/school-admin/school-admin.module';

@Module({
  controllers: [StatController],
  providers: [StatService],
  imports: [
    SchoolAdminModule,
    MongooseModule.forFeature([
      { name: School.name, schema: SchoolSchema },
      { name: SchoolAdmin.name, schema: SchoolAdminSchema },
      { name: Parent.name, schema: ParentSchema },
      { name: Teacher.name, schema: TeacherSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class StatModule {}
