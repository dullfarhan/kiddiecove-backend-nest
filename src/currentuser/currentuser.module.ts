import { forwardRef, Global, Module } from '@nestjs/common';
import { AdminModule } from 'src/admin/admin.module';
import { ParentModule } from 'src/parent/parent.module';
import { SchoolAdminModule } from 'src/school-admin/school-admin.module';
import { TeacherModule } from 'src/teacher/teacher.module';
import CurrentUser from './currentuser.service';

@Global()
@Module({
  providers: [CurrentUser],
  imports: [
    forwardRef(() => AdminModule),
    forwardRef(() => SchoolAdminModule),
    forwardRef(() => TeacherModule),
    forwardRef(() => ParentModule),
  ],
  exports: [CurrentUser],
})
export class CurrentuserModule {}
