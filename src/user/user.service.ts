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
import { ParentService } from 'src/parent/parent.service';
import { RoleType } from 'src/utils/enums/RoleType';
import { TeacherService } from 'src/teacher/teacher.service';
import { Teacher } from 'src/database/teacher.schema';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  pageNumber = 1;
  pageSize = 40;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(forwardRef(() => CurrentUser))
    private readonly currentUser: CurrentUser,
    @Inject(forwardRef(() => ParentService))
    private readonly parentService: ParentService,
    @Inject(forwardRef(() => TeacherService))
    private readonly teacherService: TeacherService,
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

async getUserForSchoolAdminListing(res: Response, req: Request) {
    let parentUser: any[];
    let teacherUser: any[];
    let user: [];
    // const currentUser = this.getCurrentUser(req, res);
    // currentUser
    //  parents
    const parentsPromis = this.parentService.getAllUserParentsforAdmin(
      req,
      res,
    );
    // parents

    let User1 = await parentsPromis.then((parents) => {
      // console.log(parents);
      parentUser = parents.map((parent) => {
        // console.log(parent);
        const newParent = {
          type: RoleType.PARENT,
          _id: parent.user._id,
          name: parent.name,
          avatar:
            parent.avatar !== undefined
              ? parent.avatar
              : 'https://www.pngarts.com/files/5/User-Avatar-Transparent.png',
        };
        return newParent;
      });

      // console.log('324');
      // console.log(user2);
      return parentUser;
    });
    const teacherPromise = this.teacherService.getTeacherUserForSchoolAdmin(
      req,
      res,
    );
   let User2 = await teacherPromise.then((teachers) => {
      // console.log(parents);
      teacherUser = teachers.map((teacher) => {
        // console.log(teacher);
        const newteacher = {
          type: RoleType.TEACHER,
          _id: teacher.user._id,
          name: teacher.name,
          avatar:
            teacher.avatar !== undefined
              ? teacher.avatar
              : 'https://www.pngarts.com/files/5/User-Avatar-Transteacher.png',
        };
        return newteacher;
      });

      // console.log('324');
      // console.log(user2);
      return teacherUser;
  });
    User1 = User1.concat(await User2);
    return Util.getOkRequest(User1, 'Users Listing Fetched Successfully', res);
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
