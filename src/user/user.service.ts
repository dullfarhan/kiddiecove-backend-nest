import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import mongoose, { ClientSession, Model } from 'mongoose';
import { User, UserDocument } from 'src/Schemas';
import Util from '../utils/util';
import { UserType } from '../utils/enums/UserType.enum';
import * as bcrypt from 'bcrypt';

import Constant from 'src/utils/enums/Constant.enum';
import { ParentType } from 'src/utils/enums/ParentType.enum';
import { GenderType } from 'src/utils/enums/GenderType.enum';
import CurrentUser from 'src/currentuser/currentuser.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  pageNumber = 1;
  pageSize = 40;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(forwardRef(() => CurrentUser))
    private readonly currentUser: CurrentUser,
  ) {}

  getAllForAdmin(res: Response) {
    this.userModel
      .find()
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ name: 1 })
      .then((result) => {
        return Util.getOkRequest(
          result,
          'Users Listing Fetched Successfully',
          res,
        );
      });
  }

  getAllForAdminListing(res: Response) {
    this.userModel
      .find({
        type: {
          $nin: [UserType.ADMIN, UserType.DRIVER, UserType.SCHOOL_ADMIN],
        },
      })
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ name: 1 })
      .select({ name: 1, type: 1, avatar: 1 })
      .then((result) => {
        return Util.getOkRequest(
          result,
          'Users Listing Fetched Successfully',
          res,
        );
      })
      .catch((ex) => {
        return Util.getBadRequest(ex.message, res);
      });
  }
  async getCurrentUser(req: Request, res: Response) {
    const response = await this.currentUser.getCurrentUserDetails(
      req,
      this.userModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    return Util.getOkRequest(response.data, 'Current User Found', res);
  }

  getAllForParentListing(res: Response) {
    this.userModel
      .find({ type: UserType.ADMIN })
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ name: 1 })
      .select({ name: 1, type: 1 })
      .then((result) => {
        return Util.getOkRequest(
          result,
          'Users Listing Fetched Successfully',
          res,
        );
      })
      .catch((ex) => {
        return Util.getBadRequest(ex.message, res);
      });
  }

  async getUserForAdmin(_id: string, res: Response) {
    try {
      const user = await this.userModel.findOne({ _id });
      if (!user) return Util.getBadRequest('User Not Found with given id', res);
      this.logger.log('User Details Fetched Succesfully');
      return Util.getOkRequest(user, 'Admin Details Fetched Successfully', res);
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async setUserAndSave(user, userObj, session) {
    await user.set(userObj);
    this.logger.log('updating user');
    return await user.save({ session });
  }

  async updateUser(user, reqBody, session) {
    return await this.setUserAndSave(
      user,
      {
        avatar: reqBody.avatar,
        name: reqBody.name,
        password: reqBody.password,
        gender:
          reqBody.gender != null
            ? reqBody.gender
            : reqBody.type.toUpperCase() === ParentType.FATHER
            ? GenderType.MALE
            : GenderType.FEMALE,
        email: reqBody.email,
        phone_number: reqBody.phone_number,
        birthday_date: reqBody.birthday_date,
        updated_at: Date.now(),
      },
      session,
    );
  }

  async updateDirectly(userId, reqBody, session) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          avatar: reqBody.avatar,
          name: reqBody.name,
          email: reqBody.email,
          password: await bcrypt.hash(reqBody.password, 10),
          gender:
            reqBody.gender != null
              ? reqBody.gender
              : reqBody.type.toUpperCase() === ParentType.FATHER
              ? GenderType.MALE
              : GenderType.FEMALE,
          phone_number: reqBody.phone_number,
          birthday_date: reqBody.birthday_date,
          updated_at: Date.now(),
        },
      },
      { session, new: true, runValidators: true },
    );
  }

  async checkUserAlreadyRegisteredOrNot(user_name) {
    this.logger.log('checking if user already registered or not?');
    return await this.userModel.findOne({ user_name: user_name });
  }

  async createAndSave(reqBody, role, address, userType, session) {
    this.logger.log('creating new user');
    console.log(reqBody);
    return await this.save(
      {
        _id: new mongoose.Types.ObjectId(),
        name: reqBody.name,
        user_name: reqBody.user_name,
        password: reqBody.password,
        gender:
          reqBody.gender != null
            ? reqBody.gender
            : reqBody.type.toUpperCase() === ParentType.FATHER
            ? GenderType.MALE
            : GenderType.FEMALE,
        type: userType,
        connected: userType === UserType.PARENT ? false : true,
        role: role,
        email: reqBody.email,
        phone_number: reqBody.phone_number,
        birthday_date: reqBody.birthday_date,
        address_id: address._id,
        avatar:
          reqBody.avatar !== undefined
            ? reqBody.avatar
            : 'https://www.pngarts.com/files/5/User-Avatar-Transparent.png',
      },
      session,
    );
  }

  async save(userObj, session: ClientSession) {
    const user = new this.userModel(userObj);
    this.logger.log('saving user...');
    return await user.save({ session });
  }
  async updateParentUserConnection(userId, session) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          connected: true,
          updated_at: Date.now(),
        },
      },
      { session, new: true, runValidators: true },
    );
  }
}
