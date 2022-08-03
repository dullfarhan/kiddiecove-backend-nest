import { forwardRef, Module } from '@nestjs/common';
import { KidService } from './kid.service';
import { KidController } from './kid.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Class,
  ClassSchema,
  Kid,
  KidSchema,
  User,
  UserSchema,
} from 'src/Schemas';
import { ParentModule } from 'src/parent/parent.module';
import { ClassModule } from 'src/class/class.module';
import { SchoolModule } from 'src/school/school.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Kid.name, schema: KidSchema },
      { name: User.name, schema: UserSchema },
      { name: Class.name, schema: ClassSchema },
    ]),
    forwardRef(() => ParentModule),
    forwardRef(() => SchoolModule),
    forwardRef(() => ClassModule),
  ],
  controllers: [KidController],
  providers: [KidService],
  exports: [KidService],
})
export class KidModule {}
