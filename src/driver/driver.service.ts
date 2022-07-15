import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { Driver, SchoolAdmin, User } from 'src/Schemas';
import Util from 'src/utils/util';
import Constant from 'src/utils/Constant';
import { UserType } from 'src/utils/enums/UserType.enum';

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

  getAllDrivers(req, res, filter, selects) {
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

  async getDriver(req, res, filter) {
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

  //   async updateDriver(req, res, schoolId) {
  //   const session = await mongoose.startSession()
  //   this.logger.log('validating req body')
  //   const { error } = validateDriver(req.body)
  //   if (error) return Util.getBadRequest(error.details[0].message, res)
  //   this.logger.log('req body is valid')
  //   try {
  //     session.startTransaction()
  //     const driver = await Driver.findOne({ _id: req.params.id })
  //     if (!driver)
  //       return Util.getBadRequest('Driver Not Found with given id', res)
  //     this.logger.log('Driver found');
  //     const city = await cityService.checkCityExistOrNot(req.body.city_id)
  //     if (!city) return Util.getBadRequest('City Not Found with given id', res)
  //     this.logger.log('city found');
  //     const school = await schoolService.checkSchoolExistOrNot(schoolId)
  //     if (!school) return Util.getBadRequest('School Not Found', res)
  //     this.logger.log('School found');
  //     const user = await User.findOne({ _id: Driver.user_id })
  //     if (!user) return Util.getBadRequest('User Not Found with given id', res)
  //     this.logger.log('user found');
  //     const address = await Address.findOne({ _id: user.address_id })
  //     if (!address)
  //       return Util.getBadRequest('Address Not Found with given id', res)
  //     this.logger.log('address found');
  //     if (req.url.includes('directly')) {
  //       await updateDirectly(req, city, school, session)
  //       this.logger.log(`Driver directly updated successfully`);
  //     } else {
  //       await update(req, address, city, school, user, driver, session)
  //       this.logger.log(`Driver updated successfully`);
  //     }
  //     await session.commitTransaction()
  //     this.logger.log('Driver and Driver User Updated Successfully');
  //     return Util.getSimpleOkRequest('Driver Successfully Updated', res)
  //   } catch (ex) {
  //     this.logger.error(ex);
  //     await session.abortTransaction()
  //     return Util.getBadRequest(ex.message, res)
  //   } finally {
  //     session.endSession()
  //   }
  // }

  // async update(req, address, city, school, user, driver, session) {
  //   await addressService.updateAddress(address, req.body, city, session)
  //   this.logger.log(`updated address ${address}`)
  //   await userService.updateUser(user, req.body, session)
  //   this.logger.log(`updated user ${user}`);
  //   return await updateAndSaveDriver(driver, req.body, city, school, session)
  // }

  getAllDriversForAdmin(req: Request, res: Response) {
    this.logger.log('getting Driver listing for admin');
    this.getAllDrivers(req, res, { enable: true }, {});
  }

  async getDriverForAdmin(req: Request, res: Response) {
    this.logger.log('getting Driver detail for admin');
    this.getDriver(req, res, { _id: req.params.id, enable: true });
  }

  async getAllDriversForSchoolAdmin(req: Request, res: Response) {
    this.logger.log('getting Drivers list for school admin');
    const response = await this.getCurrentUser(req);
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin: any = response.data;
    this.getAllDrivers(
      req,
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
    this.getDriver(req, res, {
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
      req,
      res,
      {
        enable: true,
        school_id: schoolAdmin.school_id,
      },
      { _id: 1, name: 1 },
    );
  }

  getAllDriversAsListingForAdmin(req: Request, res: Response) {
    this.logger.log('getting Driver listing for admin');
    this.getAllDrivers(
      req,
      res,
      {
        enable: true,
        school_id: req.params.id,
      },
      { _id: 1, name: 1 },
    );
  }

  async updateDriverByAdmin(req: Request, res: Response) {
    this.logger.log('Admin is updating Driver Details');
    // return await updateDriver(req, res, req.body.school_id);
  }
}
