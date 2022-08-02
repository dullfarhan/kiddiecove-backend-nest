import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/Schemas';
import { UserSignInDto } from './dtos';
import * as bcrypt from 'bcrypt';
import Util from 'src/utils/util';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private readonly logger: Logger = new Logger(AuthService.name);

  async signIn(userSignInDto: UserSignInDto, res: Response): Promise<string> {
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
            model: 'Permissions',
            select: 'endpoint -_id',
          },
        })
        .exec();
      if (user) {
        const validPassword = await bcrypt.compare(
          userSignInDto.password,
          user.password,
        );
        if (!validPassword)
          return Util.getBadRequest('Invalid user name or password', res);
        else {
          const token = user.generateAuthtoken();
          return Util.getOkRequest(token, 'Login Successfully', res);
        }
      } else {
        return Util.getBadRequest('Could not find user', res);
      }
    } catch (ex) {
      return ex.message;
    }
  }
}
