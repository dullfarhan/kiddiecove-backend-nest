import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { Driver, SchoolAdmin, User } from 'src/Schemas';
import Util from 'src/utils/util';
import Constant from 'src/utils/Constant';

@Injectable()
export class DriverService {
  private readonly logger = new Logger('Driver Service');
  private pageNumber = 1;
  private pageSize = 10;
  constructor(
    @InjectModel(Driver.name) private readonly driverModel: Model<Driver>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(SchoolAdmin.name)
    private readonly schoolAdminModel: Model<SchoolAdmin>,
  ) {}
  getAllDriversForAdmin(req: Request, res: Response) {
    this.logger.log('getting Driver listing for admin');
    this.driverModel
      .find({ enable: true })
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ name: 1 })
      .select({})
      .then((result) => {
        // this.logger.log(result);
        return Util.getOkRequest(
          result,
          'Drivers Listing Fetched Successfully',
          res,
        );
      })
      .catch((ex) => {
        this.logger.error(ex);
        return Util.getBadRequest(ex.message, res);
      });
  }

  async getDriverForAdmin(req: Request, res: Response) {
    try {
      this.logger.log('checking if Driver with given id exist or not');
      const driver = await this.driverModel.findOne({
        _id: req.params.id,
        enable: true,
      });
      if (!driver)
        return Util.getBadRequest('Driver Not Found with given id', res);
      this.logger.log('Driver exist');
      this.logger.log('Driver Details Fetched Succesfully');
      return Util.getOkRequest(
        driver,
        'Driver Details Fetched Successfully',
        res,
      );
    } catch (ex) {
      this.logger.error(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async getAllDriversForSchoolAdmin(req: Request, res: Response) {
    this.logger.log('getting Drivers list for school admin');
    const response = await this.getCurrentUser(req);
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin: any = response.data;
    this.logger.log('getting driver list');
    this.driverModel
      .find({ enable: true, school_id: schoolAdmin.school_id })
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ name: 1 })
      .select({})
      .then((result) => {
        this.logger.log(result);
        return Util.getOkRequest(
          result,
          'Drivers Listing Fetched Successfully',
          res,
        );
      })
      .catch((ex) => {
        this.logger.error(ex);
        return Util.getBadRequest(ex.message, res);
      });
  }

  async getCurrentUser(req) {
    try {
      let currentUser: any;
      this.logger.log('user id is ' + req.user._id);
      const user = await this.userModel
        .findById(req.user._id)
        .select('-password');
      if (!user) Util.getBadResponse('Current User Not Found with given id');
      this.logger.log('Current User Details Fetched Succesfully');
      currentUser = await this.getCurrentSchoolAdmin(user._id);
      return !currentUser
        ? Util.getBadResponse('Current User Not Found')
        : Util.getOkResponse(
            currentUser,
            'Current User Details Fetched Succesfully',
          );
    } catch (ex) {
      this.logger.error(ex);
      return Util.getBadResponse(ex.message);
    }
  }

  async getCurrentSchoolAdmin(_id: mongoose.Types.ObjectId) {
    this.logger.log('getting current school admin');
    return await this.schoolAdminModel.findOne({ user_id: _id });
  }

  async getDriverForSchoolAdmin(req: Request, res: Response) {
    this.logger.log('getting Driver detail for school admin');
    const response = await this.getCurrentUser(req);
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin: any = response.data;
    try {
      this.logger.log('checking if Driver with given id exist or not');
      const driver = await this.driverModel.findOne({
        enable: true,
        _id: req.params.id,
        school_id: schoolAdmin.school_id,
      });
      if (!driver)
        return Util.getBadRequest('Driver Not Found with given id', res);
      this.logger.log('Driver exist');
      this.logger.log('Driver Details Fetched Succesfully');
      return Util.getOkRequest(
        driver,
        'Driver Details Fetched Successfully',
        res,
      );
    } catch (ex) {
      this.logger.error(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }
}
