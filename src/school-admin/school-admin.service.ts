import { Injectable, Logger } from '@nestjs/common';
import mongoose, { ClientSession, Model } from 'mongoose';
import Util from 'src/utils/util';
import { CreateSchoolAdminDto } from './dto/create-school-admin.dto';
import { UpdateSchoolAdminDto } from './dto/update-school-admin.dto';
import { CityService } from 'src/city/city.service';
import { AddressService } from 'src/address/address.service';
import { RolesService } from 'src/roles/roles.service';
import { UserService } from 'src/user/user.service';
import { UserType } from 'src/enums/UserType';
import { RoleType } from 'src/enums/RoleType';

import {
  AddressDocument,
  Address,
  UserDocument,
  User,
  SchoolAdminDocument,
  SchoolAdmin,
} from 'src/Schemas';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';

@Injectable()
export class SchoolAdminService {
  pageNumber = 1;
  pageSize = 10;
  readonly logger = new Logger(SchoolAdminService.name);

  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Address.name)
    private AddressModel: Model<AddressDocument>,
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
    @InjectModel(SchoolAdmin.name)
    private SchoolAdminModel: Model<SchoolAdminDocument>,
    private readonly cityService: CityService,
    private readonly rolesService: RolesService,
    private readonly userService: UserService,
    private readonly addressService: AddressService,
  ) {}

  getAllForAdmin(req, res) {
    this.logger.log('getting School Admin list for admin');
    this.SchoolAdminModel.find({ enable: true })
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ name: 1 })
      .select({ name: 1, registered: 1, user: 1, enable: 1, deleted: 1 })
      .then((result) => {
        this.logger.log(result);
        return Util.getOkRequest(
          result,
          'School Admins Listing Fetched Successfully for admin',
          res,
        );
      })
      .catch((ex) => {
        this.logger.log(ex);
        return Util.getBadRequest(ex.message, res);
      });
  }

  getAllAsListingForRegistration(req, res) {
    this.logger.log('getting School Admin list for registration');
    this.SchoolAdminModel.find({ enable: true, registered: false })
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ name: 1 })
      .select({ name: 1 })
      .then((result) => {
        this.logger.log(result);
        return Util.getOkRequest(
          result,
          'School Admins Listing Fetched Successfully for registration',
          res,
        );
      })
      .catch((ex) => {
        this.logger.log(ex);
        return Util.getBadRequest(ex.message, res);
      });
  }

  async getForAdmin(req, res) {
    try {
      this.logger.log('checking if SchoolAdmin with given id exist or not');
      const schoolAdmin = await this.SchoolAdminModel.findOne({
        _id: req.params.id,
      });
      if (!schoolAdmin)
        return Util.getBadRequest('SchoolAdmin Not Found with given id', res);
      this.logger.log('SchoolAdmin exist');
      this.logger.log('SchoolAdmin Details Fetched Succesfully');
      return Util.getOkRequest(
        schoolAdmin,
        'SchoolAdmin Details Fetched Successfully',
        res,
      );
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async updateByAdmin(req, res) {
    const session = await mongoose.startSession();
    this.logger.log('validating req body');
    // const { error } = validateSchoolAdmin(req.body);
    // if (error) return Util.getBadRequest(error.details[0].message, res);
    this.logger.log('req body is valid');
    try {
      session.startTransaction();
      console.log('try');
      const city = await this.cityService.checkCityExistOrNot(req.body.city_id);
      if (!city) return Util.getBadRequest('City Not Found with given id', res);
      this.logger.log('city found');
      const schoolAdmin = await this.SchoolAdminModel.findOne({
        _id: req.params.id,
      });
      if (!schoolAdmin)
        return Util.getBadRequest('SchoolAdmin Not Found with given id', res);
      this.logger.log('SchoolAdmin found');
      const user = await this.UserModel.findOne({ _id: schoolAdmin.user_id });
      if (!user) return Util.getBadRequest('User Not Found with given id', res);
      this.logger.log('user found');
      const address = await this.AddressModel.findOne({ _id: user.address_id });
      if (!address)
        return Util.getBadRequest('Address Not Found with given id', res);
      this.logger.log('address found');
      await this.addressService.updateAddress(address, req.body, city, session);
      this.logger.log(`updated address ${address}`);
      await this.userService.updateUser(user, req.body, session);
      this.logger.log(`updated user ${user}`);
      await this.updateAndSaveSchoolAdmin(schoolAdmin, req.body, city, session);
      this.logger.log(`updated SchoolAdmin ${schoolAdmin}`);
      await session.commitTransaction();
      this.logger.log('SchoolAdmin and SchoolAdmin User Updated Successfully');
      Util.getSimpleOkRequest('SchoolAdmin Successfully Updated', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async updateDirectlyByAdmin(req, res) {
    const session = await this.connection.startSession();

    this.logger.log('validating req body');
    // const { error } = validateSchoolAdmin(req.body);
    // if (error) return Util.getBadRequest(error.details[0].message, res);
    this.logger.log('req body is valid');
    try {
      session.startTransaction();
      const city = await this.cityService.checkCityExistOrNot(req.body.city_id);
      if (!city) return Util.getBadRequest('City Not Found', res);
      this.logger.log('city found');
      const schoolAdmin = await this.updateDirectly(
        req.params.id,
        req.body,
        city,
        session,
      );
      this.logger.log(`updated SchoolAdmin ${schoolAdmin}`);
      const user = await this.userService.updateDirectly(
        schoolAdmin.user_id,
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
      this.logger.log('SchoolAdmin and SchoolAdmin User Updated Successfully');
      return Util.getSimpleOkRequest('SchoolAdmin Successfully Updated', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async deleteByAdmin(req, res) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      const schoolAdmin = await this.SchoolAdminModel.findByIdAndRemove(
        req.params.id,
        {
          session,
        },
      );
      if (!schoolAdmin)
        return Util.getBadRequest('SchoolAdmin Not Found with given id', res);
      this.logger.log('SchoolAdmin Successfully Deleted');
      const user = await this.UserModel.findByIdAndRemove(schoolAdmin.user_id, {
        session,
      });
      if (!user) return Util.getBadRequest('User Not Found with given id', res);
      this.logger.log('User Successfully Deleted');
      const address = await this.AddressModel.findByIdAndRemove(
        user.address_id,
        {
          session,
        },
      );
      if (!address)
        return Util.getBadRequest('Address Not Found with given id', res);
      this.logger.log('Address Successfully Deleted');
      await session.commitTransaction();
      return Util.getSimpleOkRequest('SchoolAdmin Successfully deleted', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async createByAdmin(req: Request, res: Response) {
    //Joi validation checking

    const session: ClientSession = await this.connection.startSession();
    this.logger.log('validating req body');

    // const { error } = validateSchoolAdmin(req.body);
    // if (error) return Util.getBadRequest(error.details[0].message, res);

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
      const role = await this.rolesService.getRole(RoleType.SCHOOL_ADMIN);
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
        UserType.SCHOOL_ADMIN,
        session,
      );
      this.logger.log('SchoolAdmin User Created Successfully');
      const schoolAdmin = await this.createAndSave(
        req.body,
        user,
        city,
        session,
      );
      await session.commitTransaction();
      this.logger.log('SchoolAdmin Created Successfully');
      // const token = user.generateAuthToken()
      return Util.getSimpleOkRequest('SchoolAdmin Created Successfully', res);
    } catch (ex) {
      this.logger.log('Error While Creating School Admin ' + ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async save(schoolAdminObj, session) {
    this.logger.log('creating new SchoolAdmin');
    // const driver = new Model<Driver>(driverObj);
    const schoolAdmin = new Model<SchoolAdmin>(schoolAdminObj);
    this.logger.log('saving SchoolAdmin...');
    return await schoolAdmin.save({ session });
  }

  async createAndSave(reqBody, user, city, session) {
    return await this.save(
      {
        _id: new mongoose.Types.ObjectId(),
        name: reqBody.name,
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
      },
      session,
    );
  }

  async setSchoolAdminAndSave(schoolAdmin, schoolAdminObj, session) {
    await schoolAdmin.set(schoolAdminObj);
    this.logger.log('updating SchoolAdmin');
    await schoolAdmin.save({ session });
  }

  async updateDirectly(id, reqBody, city, session) {
    return await this.SchoolAdminModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: reqBody.name,
          salary: reqBody.salary,
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

  async addSchool(id, reqBody, session, school) {
    return await this.SchoolAdminModel.findByIdAndUpdate(
      id,
      {
        $set: {
          'school.name': reqBody.name,
          'school.description': reqBody.description,
          'school.type': reqBody.type,
          'school.campus_code': reqBody.campus_code,
          'school.branch_name': reqBody.branch_name,
          'school.email': reqBody.email,
          'school.phone_number': reqBody.phone_number,
          registered: true,
          updated_at: Date.now(),
          school_id: school._id,
        },
      },
      { session, new: true, runValidators: true },
    );
  }

  async removeSchool(id, session) {
    return await this.SchoolAdminModel.findByIdAndUpdate(
      id,
      {
        $set: {
          registered: false,
          updated_at: Date.now(),
        },
        $unset: {
          school: 1,
          school_id: 1,
        },
      },
      { session, new: true },
    );
  }

  async updateAndSaveSchoolAdmin(schoolAdmin, reqBody, city, session) {
    return await this.setSchoolAdminAndSave(
      schoolAdmin,
      {
        name: reqBody.name,
        salary: reqBody.salary,
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

  async checkSchoolAdminExistOrNot(schoolAdminId) {
    this.logger.log('checking if school admin exists or not?');
    return await this.SchoolAdminModel.findOne({ _id: schoolAdminId });
  }

  async getCurrentSchoolAdmin(userId) {
    this.logger.log('getting current school admin');
    return await this.SchoolAdminModel.findOne({ user_id: userId });
  }
  /////////////////////////////////////////////
  create(createSchoolAdminDto: CreateSchoolAdminDto) {
    return 'This action adds a new schoolAdmin';
  }

  findAll() {
    return `This action returns all schoolAdmin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schoolAdmin`;
  }

  update(id: number, updateSchoolAdminDto: UpdateSchoolAdminDto) {
    return `This action updates a #${id} schoolAdmin`;
  }

  remove(id: number) {
    return `This action removes a #${id} schoolAdmin`;
  }
}
