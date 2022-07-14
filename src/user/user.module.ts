import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema, User, UserSchema } from 'src/Schemas';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Address.name, schema: AddressSchema },
    ]),
  ],
})
export class UserModule {}
