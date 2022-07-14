import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/Schemas';
import Util from '../utils/util';
import { UserType } from '../utils/enums/UserType.enum';
import Constant from 'src/utils/Constant';
import { getCurrentUserDetails } from '../utils/CurrentUser';

@Injectable()
export class UserService {
  pageNumber = 1;
  pageSize = 20;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  getAllForAdmin(req: Request, res: Response) {
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

  getAllForAdminListing(req: Request, res: Response) {
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
    const response = await getCurrentUserDetails(req, this.userModel);
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);

    return Util.getOkRequest(response.data, 'Current User Found', res);
  }

  getAllForParentListing(req: Request, res: Response) {
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
}
