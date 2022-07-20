import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserSchema } from 'src/Schemas';
import { UserSignInDto } from './dtos';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private readonly logger: Logger = new Logger('Authentication Service');

  async signIn(userSignInDto: UserSignInDto): Promise<string> {
    this.logger.log('Signing In');
    try {
      const user: User = await this.userModel
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
      console.log(user);
      if (user) {
        const validPassword = await bcrypt.compare(
          userSignInDto.password,
          user.password,
        );
        if (!validPassword) return 'Invalid user name or password';
        else {
          const token = user.generateAuthtoken();
          return token;
        }
      } else {
        return 'Could not find the user';
      }
    } catch (ex) {
      return ex.message;
    }
  }
}
