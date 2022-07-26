import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema, User, UserSchema } from 'src/Schemas';
import { SchoolAdminModule } from 'src/school-admin/school-admin.module';
import { TeacherModule } from 'src/teacher/teacher.module';
import { SchoolModule } from 'src/school/school.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Class.name, schema: ClassSchema },
      { name: User.name, schema: UserSchema },
    ]),
    SchoolAdminModule,
    TeacherModule,
    SchoolModule,
  ],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
