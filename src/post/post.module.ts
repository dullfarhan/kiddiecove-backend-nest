import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema, User, UserSchema, Post } from 'src/Schemas';
import { SchoolAdminModule } from 'src/school-admin/school-admin.module';
import { TeacherModule } from 'src/teacher/teacher.module';
import { AdminModule } from 'src/admin/admin.module';
import { SchoolModule } from 'src/school/school.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
    ]),
    SchoolAdminModule,
    TeacherModule,
    AdminModule,
    SchoolModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
