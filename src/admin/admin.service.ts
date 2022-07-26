import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { AddressService } from 'src/address/address.service';
import { CityService } from 'src/city/city.service';
import { RoleType } from 'src/utils/enums/RoleType';
import { UserType } from 'src/utils/enums/UserType';
import { RolesService } from 'src/roles/roles.service';
import {
  Address,
  AddressDocument,
  Admin,
  AdminDocument,
  User,
  UserDocument,
} from 'src/Schemas';
import { UserService } from 'src/user/user.service';
import Util from 'src/utils/util';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  private readonly pageNumber = 1;
  private readonly pageSize = 10;
  private readonly logger: Logger = new Logger(AdminService.name);
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,
    private readonly addressService: AddressService,
    private readonly cityService: CityService,
    private readonly userService: UserService,
    private readonly rolesService: RolesService,
  ) {}

  getAllAdmins(res: Response) {
    this.logger.log('getting admin list');
    this.adminModel
      .find({ enable: true })
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ name: 1 })
      .select({ name: 1, user: 1, enable: 1, deleted: 1 })
      .then((result) => {
        this.logger.log(result);
        return Util.getOkRequest(
          result,
          'Admins Listing Fetched Successfully',
          res,
        );
      })
      .catch((ex) => {
        this.logger.log(ex);
        Util.getBadRequest(ex.message, res);
      });
  }

  async getAdmin(id, res) {
    try {
      this.logger.log('checking if admin with given id exist or not');
      const admin = await this.adminModel.findOne({ _id: id });
      if (!admin)
        return Util.getBadRequest('Admin Not Found with given id', res);
      this.logger.log('Admin exist');
      this.logger.log('Admin Details Fetched Succesfully');
      return Util.getOkRequest(
        admin,
        'Admin Details Fetched Successfully',
        res,
      );
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async updateAdminDirectly(id: string, req: Request, res: Response) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const city = await this.cityService.checkCityExistOrNot(req.body.city_id);
      if (!city) return Util.getBadRequest('City Not Found', res);
      this.logger.log('city found');
      const admin = await this.updateDirectly(id, req.body, city, session);
      this.logger.log(`updated admin ${admin}`);
      const user = await this.userService.updateDirectly(
        admin.user_id,
        req.body,
        session,
      );
      this.logger.log(`updated user ${user}`);
      const address = await this.addressService.updateDirectly(
        user.address_id,
        req.body,
        city,
        session,
      );
      this.logger.log(`updated address ${address}`);
      await session.commitTransaction();
      this.logger.log('Admin and Admin User Updated Successfully');
      return Util.getSimpleOkRequest('Admin Successfully Updated', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async updateDirectly(id, reqBody, city, session) {
    return await this.adminModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: reqBody.name,
          admin_type: reqBody.admin_type,
          'user.gender': reqBody.gender,
          'user.email': reqBody.email,
          'user.phone_number': reqBody.phone_number,
          'user.address.address_details': reqBody.address_details,
          'user.address.area_name': reqBody.area_name,
          'user.address.city': city.name,
          'user.updated_at': Date.now(),
        },
      },
      { session, new: true, runValidators: true },
    );
  }

  async updateAdmin(req: Request, res: Response) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const city = await this.cityService.checkCityExistOrNot(req.body.city_id);
      if (!city) return Util.getBadRequest('City Not Found with given id', res);
      this.logger.log('city found');
      const admin = await this.adminModel.findOne({ _id: req.params.id });
      if (!admin)
        return Util.getBadRequest('Admin Not Found with given id', res);
      this.logger.log('admin found');
      const user = await this.userModel.findOne({ _id: admin.user_id });
      if (!user) return Util.getBadRequest('User Not Found with given id', res);
      this.logger.log('user found');

      const address = await this.addressModel.findOne({ _id: user.address_id });
      if (!address)
        return Util.getBadRequest('Address Not Found with given id', res);
      this.logger.log('address found');
      await this.addressService.updateAddress(address, req.body, city, session);
      this.logger.log(`updated address ${address}`);
      await this.userService.updateUser(user, req.body, session);
      this.logger.log(`updated user ${user}`);
      await this.updateAndSaveAdmin(admin, req.body, city, session);
      this.logger.log(`updated admin ${admin}`);
      await session.commitTransaction();
      this.logger.log('Admin and Admin User Updated Successfully');
      return Util.getSimpleOkRequest('Admin Successfully Updated', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async updateAndSaveAdmin(admin, reqBody, city, session) {
    return await this.setAdminAndSave(
      admin,
      {
        name: reqBody.name,
        admin_type: reqBody.admin_type,
        'user.user_name': reqBody.user_name,
        'user.gender': reqBody.gender,
        'user.email': reqBody.email,
        'user.phone_number': reqBody.phone_number,
        'user.address.address_details': reqBody.address_details,
        'user.address.area_name': reqBody.area_name,
        'user.address.city': city.name,
        'user.updated_at': Date.now(),
      },
      session,
    );
  }
  async setAdminAndSave(admin, adminObj, session) {
    await admin.set(adminObj);
    this.logger.log('updating admin');
    return await admin.save({ session });
  }

  async deleteAdmin(id: mongoose.Types.ObjectId, res: Response) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const admin = await this.adminModel.findByIdAndRemove(id, {
        session,
      });
      if (!admin)
        return Util.getBadRequest('Admin Not Found with given id', res);
      this.logger.log('Admin Successfully Deleted');
      const user = await this.userModel.findByIdAndRemove(admin.user_id, {
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
      return Util.getSimpleOkRequest('Admin Successfully deleted', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async createAdmin(req: Request, res: Response) {
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
      const role = await this.rolesService.getRole(RoleType.ROOT);
      if (!role) return Util.getBadRequest('Role Not Found', res);
      this.logger.log('role found');
      const address = await this.addressService.createAndSave(
        req.body,
        city,
        session,
      );
      this.logger.log('User Address Created Successfully');
      const user = await this.userService.createAndSave(
        req.body,
        role,
        address,
        UserType.ADMIN,
        session,
      );
      this.logger.log('Admin User Created Successfully');
      const admin = await this.createAndSave(req.body, user, city, session);
      await session.commitTransaction();
      this.logger.log('Admin Created Successfully');
      const token = user.generateAuthtoken();
      return Util.getSimpleOkRequest('Admin Created Successfully', res);
    } catch (ex) {
      this.logger.log('Error While Creating Admin ' + ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async createAndSave(reqBody, user, city, session) {
    this.logger.log('creating new user');
    return await this.save(
      {
        _id: new mongoose.Types.ObjectId(),
        name: reqBody.name,
        admin_type: reqBody.admin_type,
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
      },
      session,
    );
  }

  async save(adminObj, session) {
    this.logger.log('creating new admin');
    const admin = new this.adminModel(adminObj);
    this.logger.log('saving admin...');
    return await admin.save({ session });
  }

  async getCurrentAdmin(userId) {
    this.logger.log('getting current admin');
    return await this.adminModel.findOne({ user_id: userId });
  }
}
