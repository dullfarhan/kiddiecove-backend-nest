import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
  RoleDocument,
  Role,
  Permission,
  PermissionDocument,
} from 'src/Schemas';
import { UserSignInDto } from './dtos';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private user: Model<UserDocument>,
  ) {}

  async signIn(userSignInDto: UserSignInDto): Promise<String> {
    try {
      const user = await this.user
        .findOne({ user_name: userSignInDto.name })
        .populate({
          path: 'role',
          model: 'Role',
          select: 'name -_id',
          populate: {
            path: 'permissions',
            model: 'Permission',
            select: 'endpoint -_id',
          },
        })
        .exec();
      const validPassword = await bcrypt.compare(
        userSignInDto.password,
        user.password,
      );
      if (!validPassword) return 'Invalid user name or password';
      else {
        const token = this.jwtService.signAsync(
          {
            _id: user._id,
            type: user.type,
            user_name: user.user_name,
            avatar: user.avatar,
            connected: user.connected,
            name: user.name,
            email: user.email,
          },
          {
            secret: 'mySecureKey',
          },
        );

        console.log(user);
        return token;
      }
    } catch (ex) {
      console.log(ex);
      return 'Error While Authenticating';
    }
  }
}
