import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { Driver, SchoolAdmin, User } from 'src/Schemas';
import Util from 'src/utils/util';
import Constant from 'src/utils/Constant';
import Debug from 'debug';

@Injectable()
export class DriverService {
  serviceDebugger = Debug('app:services:teacher');
  private readonly logger = new Logger('Driver Service');
  private pageNumber = 1;
  private pageSize = 10;
  constructor(
    @InjectModel(Driver.name) private readonly driverModel: Model<Driver>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(SchoolAdmin.name)
    private readonly schoolAdminModel: Model<SchoolAdmin>,
  ) {}

  getAllDrivers(res: Response, filter: Object, selects: Object) {
    this.logger.log('getting driver list');
    this.driverModel
      .find(filter)
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ name: 1 })
      .select(selects)
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

  async getDriver(res: Response, filter: Object) {
    try {
      this.logger.log('checking if Driver with given id exist or not');
      const driver = await this.driverModel.findOne(filter);
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

  async getCurrentUser(req: any) {
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

  getAllDriversForAdmin(res: Response) {
    this.logger.log('getting Driver listing for admin');
    this.getAllDrivers(res, { enable: true }, {});
  }

  async getDriverForAdmin(id: mongoose.Types.ObjectId, res: Response) {
    this.logger.log('getting Driver detail for admin');
    this.getDriver(res, { _id: id, enable: true });
  }

  async getAllDriversForSchoolAdmin(req: Request, res: Response) {
    this.logger.log('getting Drivers list for school admin');
    const response = await this.getCurrentUser(req);
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin: any = response.data;
    this.getAllDrivers(
      res,
      {
        enable: true,
        school_id: schoolAdmin.school_id,
      },
      {},
    );
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
    this.getDriver(res, {
      enable: true,
      _id: req.params.id,
      school_id: schoolAdmin.school_id,
    });
  }

  async getAllDriversAsListingForSchoolAdmin(req: Request, res: Response) {
    this.logger.log('getting Drivers listing for school admin');
    const response = await this.getCurrentUser(req);
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin: any = response.data;
    this.getAllDrivers(
      res,
      {
        enable: true,
        school_id: schoolAdmin.school_id,
      },
      { _id: 1, name: 1 },
    );
  }

  getAllDriversAsListingForAdmin(id: mongoose.Types.ObjectId, res: Response) {
    this.logger.log('getting Driver listing for admin');
    this.getAllDrivers(
      res,
      {
        enable: true,
        school_id: id,
      },
      { _id: 1, name: 1 },
    );
  }

  async updateDriverByAdmin(id: mongoose.Types.ObjectId, res: Response) {
    this.logger.log('Admin is updating Driver Details');
    // return await updateDriver(req, res, req.body.school_id);
  }

  async updateDriverBySchoolAdmin(req: Request, res: Response) {
    this.serviceDebugger('School Admin is updating Driver Details');
    const response = await this.getCurrentUser(req);
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.serviceDebugger('Current School Admin User Found');
    const schoolAdmin = response.data;
  }

  deleteDriverByAdmin(req: Request, res: Response) {}

  deleteDriverBySchoolAdmin(req: Request, res: Response) {}

  createDriverByAdmin(req: Request, res: Response) {}

  createDriverBySchoolAdmin(req: Request, res: Response) {}
}
