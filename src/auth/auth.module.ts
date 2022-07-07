import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './Strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Permission,
  PermissionSchema,
  Role,
  RoleSchema,
  User,
  UserSchema,
} from 'src/Schemas';

@Module({
  providers: [AuthService, JwtStrategy],
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  exports: [JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
