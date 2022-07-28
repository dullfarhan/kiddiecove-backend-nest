import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import mongoose, { ClientSession, Model } from 'mongoose';
import {
  Address,
  AddressDocument,
  City,
  CityDocument,
  Driver,
  DriverDocument,
  School,
  SchoolAdmin,
  SchoolAdminDocument,
  SchoolDocument,
  User,
  UserDocument,
} from 'src/Schemas';
import Util from 'src/utils/util';
import Constant from 'src/utils/enums/Constant.enum';
import Debug from 'debug';
import { CityService } from 'src/city/city.service';
import { SchoolService } from 'src/school/school.service';
import { AddressService } from 'src/address/address.service';
import { UserService } from 'src/user/user.service';
import { UpdateDriverDtoWithUserAndAddress } from './dtos/update-driver.dto';
import { RolesService } from 'src/roles/roles.service';
import { RoleType } from 'src/utils/enums/RoleType';
import { UserType } from 'src/utils/enums/UserType';
import CurrentUser from 'src/currentuser/currentuser.service';

@Injectable()
export class DriverService {
  private readonly logger = new Logger(DriverService.name);
  private pageNumber = 1;
  private pageSize = 10;
  constructor(
    @InjectModel(Driver.name)
    private readonly driverModel: Model<DriverDocument>,
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(SchoolAdmin.name)
    private readonly schoolAdminModel: Model<SchoolAdminDocument>,
    private readonly cityService: CityService,
    private readonly schoolService: SchoolService,
    private readonly addressService: AddressService,
    private readonly userService: UserService,
    private readonly rolesService: RolesService,
    private readonly currentUser: CurrentUser,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  getAllDrivers(res: Response, filter: Object, selects: Object) {
    this.logger.log('getting driver list');
    const result = this.driverModel
      .find(filter)
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ name: 1 })
      .select(selects)
      .then((result) => {
        console.log(result);
        return Util.getOkRequest(
          result,
          'Drivers Listing Fetched Successfully',
          res,
        );
      })
      .catch((ex) => {
        this.logger.error(ex.message);
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
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.DRIVER,
      this.userModel,
    );
    this.logger.log('Response: ', response.status);
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
    this.logger.log('getting current school admin', _id);
    return this.schoolAdminModel.findOne({ user_id: _id });
  }

  async getDriverForSchoolAdmin(
    id: mongoose.Types.ObjectId,
    req: Request,
    res: Response,
  ) {
    this.logger.log('getting Driver detail for school admin');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.DRIVER,
      this.userModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin: any = response.data;
    this.getDriver(res, {
      enable: true,
      _id: id,
      school_id: schoolAdmin.school_id,
    });
  }

  async getAllDriversAsListingForSchoolAdmin(req: Request, res: Response) {
    this.logger.log('getting Drivers listing for school admin');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.DRIVER,
      this.userModel,
    );
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

  async updateDriverByAdmin(
    id: mongoose.Types.ObjectId,
    res: Response,
    updateDriverDto: UpdateDriverDtoWithUserAndAddress,
    isDirect: boolean = false,
  ) {
    this.logger.log('Admin is updating Driver Details');
    return await this.updateDriver(id, res, updateDriverDto, isDirect);
  }

  async updateDriverBySchoolAdmin(
    id: mongoose.Types.ObjectId,
    res: Response,
    updateDriverDto: UpdateDriverDtoWithUserAndAddress,
    req,
  ) {
    this.logger.log('School Admin is updating Driver Details');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.DRIVER,
      this.userModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin = response.data;
    return await this.updateDriver(id, res, updateDriverDto);
  }

  async deleteDriverByAdmin(id: mongoose.Types.ObjectId, res: Response) {
    this.logger.log('Admin is deleting Driver');

    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const driver = await this.driverModel.findByIdAndRemove(id, {
        session,
      });
      if (!driver)
        return Util.getBadRequest('Driver Not Found with given id', res);
      this.logger.log('Driver Successfully Deleted');
      const user = await this.userModel.findByIdAndRemove(driver.user_id, {
        session,
      });
      if (!user) return Util.getBadRequest('User Not Found with given id', res);
      this.logger.log('User Successfully Deleted');
      const address = await this.addressModel.findByIdAndRemove(
        user.address_id,
        {
          session,
        },
      );
      if (!address)
        return Util.getBadRequest('Address Not Found with given id', res);
      this.logger.log('Address Successfully Deleted');
      await session.commitTransaction();
      return Util.getSimpleOkRequest('Driver Successfully deleted', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async deleteDriverBySchoolAdmin(
    id: mongoose.Types.ObjectId,
    req: Request,
    res: Response,
  ) {
    this.logger.log('School Admin is deleting Driver');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.DRIVER,
      this.userModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin = response.data;
    const driver = await this.checkDriverExistenceWithSchool(
      id,
      schoolAdmin.school_id,
    );
    if (!driver)
      return Util.getBadRequest('Driver Does not Belong To this School', res);
    return await this.deleteDriver(id, res);
  }

  async checkDriverExistenceWithSchool(driverId, schoolId) {
    this.logger.log('checking school existence with Driver');
    return await this.driverModel.findOne({
      _id: driverId,
      school_id: schoolId,
    });
  }

  async deleteDriver(id: mongoose.Types.ObjectId, res: Response) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const driver = await this.driverModel.findByIdAndRemove(id, {
        session,
      });
      if (!driver)
        return Util.getBadRequest('Driver Not Found with given id', res);
      this.logger.log('Driver Successfully Deleted');
      const user = await this.userModel.findByIdAndRemove(driver.user_id, {
        session,
      });
      if (!user) return Util.getBadRequest('User Not Found with given id', res);
      this.logger.log('User Successfully Deleted');
      const address = await this.addressModel.findByIdAndRemove(
        user.address_id,
        {
          session,
        },
      );
      if (!address)
        return Util.getBadRequest('Address Not Found with given id', res);
      this.logger.log('Address Successfully Deleted');
      await session.commitTransaction();
      return Util.getSimpleOkRequest('Driver Successfully deleted', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async createDriverByAdmin(req: Request, res: Response) {
    this.logger.log('admin is creating Driver');
    this.createDriver(req, res, req.body.school_id);
  }

  async createAndSave(
    reqBody,
    newUser,
    city,
    newSchool,
    session: ClientSession,
  ) {
    const school = newSchool.toObject();

    const user = newUser.toObject();
    this.logger.log('Saving Driver...');
    return await this.save(
      {
        _id: new mongoose.Types.ObjectId(),
        name: reqBody.name,
        license_number: reqBody.license_number,
        salary: reqBody.salary,
        user: {
          _id: new mongoose.Types.ObjectId(),
          user_name: reqBody.user_name,
          gender: reqBody.gender,
          email: reqBody.email,
          phone_number: reqBody.phone_number,
          address: {
            _id: new mongoose.Types.ObjectId(),
            address_details: reqBody.address_details,
            area_name: reqBody.area_name,
            city: city.name,
          },
        },
        user_id: user._id,
        school_id: school._id,
        school_name: school.name,
      },
      session,
    );
  }

  async save(driverObj, session: ClientSession) {
    console.log(driverObj);
    this.logger.log('creating new Driver');
    const driver = new this.driverModel(driverObj);
    this.logger.log('saving Driver...');
    const driverCreated = await driver.save({ session });
    console.log('DRIVERCREATED', driverCreated);
    return driverCreated;
  }

  async createDriverBySchoolAdmin(req: Request, res: Response) {
    this.logger.log('school admin is creating Driver');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.DRIVER,
      this.userModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin = response.data;
    return await this.createDriver(req, res, schoolAdmin.school_id);
  }

  async createDriver(
    req: Request,
    res: Response,
    schoolId: mongoose.Types.ObjectId,
  ) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      if (
        await this.userService.checkUserAlreadyRegisteredOrNot(
          req.body.user_name,
        )
      )
        return Util.getBadRequest('User already registered', res);
      this.logger.log('user not registered');
      const city = await this.cityService.checkCityExistOrNot(req.body.city_id);
      if (!city) return Util.getBadRequest('City Not Found', res);
      this.logger.log('city found');
      const school = await this.schoolService.checkSchoolExistOrNot(schoolId);
      if (!school) return Util.getBadRequest('School Not Found', res);
      this.logger.log('School found');
      const role = await this.rolesService.getRole(RoleType.DRIVER);
      if (!role) return Util.getBadRequest('Role Not Found', res);
      this.logger.log('role found');
      const address = await this.addressService.createAndSave(
        req.body,
        city,
        session,
      );
      console.log('address', address);
      this.logger.log('User Address Created Successfully');
      const user = await this.userService.createAndSave(
        req.body,
        role,
        address,
        UserType.DRIVER,
        session,
      );
      this.logger.log('Driver User Created Successfully');

      const driver = await this.createAndSave(
        req.body,
        user,
        city,
        school,
        session,
      );
      await session.commitTransaction();
      this.logger.log('Driver Created Successfully');
      return Util.getSimpleOkRequest('Driver Created Successfully', res);
    } catch (ex) {
      this.logger.log('Error While Creating Admin ' + ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async updateDriver(
    id: mongoose.Types.ObjectId,
    res: Response,
    updateDriverDto: UpdateDriverDtoWithUserAndAddress,
    isDirect = false,
  ) {
    const session: ClientSession = await this.connection.startSession();
    try {
      const driver = await this.driverModel.findOne({
        _id: id,
      });

      if (!driver)
        return Util.getBadRequest('Driver Not Found with given id', res);
      this.logger.log('Driver found');
      const city = await this.cityService.checkCityExistOrNot(
        updateDriverDto.city_id,
      );
      if (!city) return Util.getBadRequest('City Not Found with given id', res);
      this.logger.log('City found');
      const school: SchoolDocument =
        await this.schoolService.checkSchoolExistOrNot(
          updateDriverDto.school_id,
        );
      if (!school) return Util.getBadRequest('School Not Found', res);
      this.logger.log('School found');
      const user: UserDocument = await this.userModel.findOne({
        _id: driver.user_id,
      });
      if (!user) return Util.getBadRequest('User Not Found with given id', res);
      this.logger.log('user found');

      const address: AddressDocument = await this.addressModel.findOne({
        _id: user.address_id,
      });
      if (!address)
        return Util.getBadRequest('Address Not Found with given id', res);
      this.logger.log('address found');
      if (isDirect) {
        await this.updateDirectly(id, updateDriverDto, city, school, session);
        this.logger.log(`Driver directly updated successfully`);
      } else {
        await this.update(
          updateDriverDto,
          address,
          city,
          school,
          user,
          driver,
          session,
        );
        this.logger.log(`Driver updated successfully`);
      }
      await session.commitTransaction();
      this.logger.log('Driver and Driver User Updated Successfully');
      return Util.getSimpleOkRequest('Driver Successfully Updated', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async update(
    updateDriverDto: UpdateDriverDtoWithUserAndAddress,
    address: AddressDocument,
    city: CityDocument,
    school: SchoolDocument,
    user: UserDocument,
    driver: DriverDocument,
    session: ClientSession,
  ) {
    await this.addressService.updateAddress(
      address,
      updateDriverDto,
      city,
      session,
    );
    this.logger.log(`updated address ${address}`);
    await this.userService.updateUser(user, updateDriverDto, session);
    this.logger.log(`updated user ${user}`);
    return await this.updateAndSaveDriver(
      driver,
      updateDriverDto,
      city,
      school,
      session,
    );
  }

  async updateAndSaveDriver(
    driver: DriverDocument,
    reqBody: any,
    city: CityDocument,
    school: SchoolDocument,
    session: ClientSession,
  ) {
    return await this.setDriverAndSave(
      driver,
      {
        name: reqBody.name,
        designation: reqBody.designation,
        salary: reqBody.salary,
        'user.user_name': reqBody.user_name,
        'user.gender': reqBody.gender,
        'user.email': reqBody.email,
        'user.phone_number': reqBody.phone_number,
        'user.address.address_details': reqBody.address_details,
        'user.address.area_name': reqBody.area_name,
        'user.address.city': city.name,
        'user.updated_at': Date.now(),
        school_id: school._id,
        school_name: school.name,
      },
      session,
    );
  }

  async setDriverAndSave(driver: any, driverObj: any, session: ClientSession) {
    await driver.set(driverObj);
    this.logger.log('updating Driver');
    await driver.save({ session });
  }

  async updateDirectly(
    id: mongoose.Types.ObjectId,
    updateDriverDto: UpdateDriverDtoWithUserAndAddress,
    city: CityDocument,
    school: SchoolDocument,
    session: ClientSession,
  ) {
    const driver = await this.updateDirectly2(
      id,
      updateDriverDto,
      city,
      school,
      session,
    );
    this.logger.log(`updated Driver ${Driver}`);
    const user = await this.userService.updateDirectly(
      driver.user_id,
      updateDriverDto,
      session,
    );
    this.logger.log(`updated user ${user}`);
    return await this.addressService.updateDirectly(
      user.address_id,
      updateDriverDto,
      city,
      session,
    );
  }

  async updateDirectly2(
    id: mongoose.Types.ObjectId,
    reqBody: UpdateDriverDtoWithUserAndAddress,
    city: CityDocument,
    school: SchoolDocument,
    session: ClientSession,
  ) {
    return await this.driverModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: reqBody.name,
          license_number: reqBody.license_number,
          salary: reqBody.salary,
          'user.gender': reqBody.gender,
          'user.email': reqBody.email,
          'user.phone_number': reqBody.phone_number,
          'user.address.address_details': reqBody.address_details,
          'user.address.area_name': reqBody.area_name,
          'user.address.city': city.name,
          'user.updated_at': Date.now(),
          school_id: school._id,
          school_name: school.name,
        },
      },
      { session, new: true, runValidators: true },
    );
  }
}
