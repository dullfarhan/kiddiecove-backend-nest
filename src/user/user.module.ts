import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParentModule } from 'src/parent/parent.module';
import { Address, AddressSchema, User, UserSchema } from 'src/Schemas';
import { TeacherModule } from 'src/teacher/teacher.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Address.name, schema: AddressSchema },
    ]),
    ParentModule,
    forwardRef(() => TeacherModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
