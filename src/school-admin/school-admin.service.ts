import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { AddressService } from 'src/address/address.service';
import { CityService } from 'src/city/city.service';
import { RoleType } from 'src/enums/RoleType';
import { UserType } from 'src/enums/UserType';
import { RolesService } from 'src/roles/roles.service';
import {
  Address,
  AddressDocument,
  SchoolAdmin,
  SchoolAdminDocument,
  User,
  UserDocument,
} from 'src/Schemas';
import { UserService } from 'src/user/user.service';
import Util from 'src/utils/util';
import { UpdateSchoolAdminDto } from './dto/update-school-admin.dto';

@Injectable()
export class SchoolAdminService {
  private pageNumber = 1;
  private pageSize = 10;
  private readonly logger: Logger = new Logger(SchoolAdmin.name);
  constructor(
    @InjectModel(SchoolAdmin.name)
    private readonly schoolAdminModel: Model<SchoolAdminDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly addressService: AddressService,
    private readonly cityService: CityService,
    private readonly userService: UserService,
    private readonly rolesService: RolesService,
  ) {}

  async getCurrentSchoolAdmin(userId) {
    this.logger.log('getting current school admin');
    return await this.schoolAdminModel.findOne({ user_id: userId });
  }

  async getAllForAdmin(res: Response) {
    this.logger.log('getting School Admin list for admin');
    this.schoolAdminModel
      .find({ enable: true })
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ name: 1 })
      .select({ name: 1, registered: 1, user: 1, enable: 1, deleted: 1 })
      .then((result) => {
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

  async getForAdmin(id: string, res: Response) {
    try {
      this.logger.log('checking if SchoolAdmin with given id exist or not');
      const schoolAdmin = await this.schoolAdminModel.findOne({
        _id: id,
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

  getAllAsListingForRegistration(res) {
    this.logger.log('getting School Admin list for registration');
    this.schoolAdminModel
      .find({ enable: true, registered: false })
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

  async updateByAdmin(
    id: string,
    updateSchoolAdminDto: UpdateSchoolAdminDto,
    res: Response,
  ) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const city = await this.cityService.checkCityExistOrNot(
        updateSchoolAdminDto.city_id,
      );
      if (!city) return Util.getBadRequest('City Not Found with given id', res);
      this.logger.log('city found');
      const schoolAdmin = await this.schoolAdminModel.findOne({
        _id: id,
      });
      if (!schoolAdmin)
        return Util.getBadRequest('SchoolAdmin Not Found with given id', res);
      this.logger.log('SchoolAdmin found');
      const user = await this.userModel.findOne({ _id: schoolAdmin.user_id });
      if (!user) return Util.getBadRequest('User Not Found with given id', res);
      this.logger.log('user found');
      const address = await this.addressModel.findOne({ _id: user.address_id });
      if (!address)
        return Util.getBadRequest('Address Not Found with given id', res);
      this.logger.log('address found');
      await this.addressService.updateAddress(
        address,
        updateSchoolAdminDto,
        city,
        session,
      );
      this.logger.log(`updated address ${address}`);
      await this.userService.updateUser(user, updateSchoolAdminDto, session);
      this.logger.log(`updated user ${user}`);
      await this.updateAndSaveSchoolAdmin(
        schoolAdmin,
        updateSchoolAdminDto,
        city,
        session,
      );
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
  async setSchoolAdminAndSave(schoolAdmin, schoolAdminObj, session) {
    await schoolAdmin.set(schoolAdminObj);
    this.logger.log('updating SchoolAdmin');
    await schoolAdmin.save({ session });
  }

  async updateDirectlyByAdmin(
    id: string,
    updateSchoolAdminDto: UpdateSchoolAdminDto,
    res: Response,
  ) {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      const city = await this.cityService.checkCityExistOrNot(
        updateSchoolAdminDto.city_id,
      );
      if (!city) return Util.getBadRequest('City Not Found', res);
      this.logger.log('city found');
      const schoolAdmin = await this.updateDirectly(
        id,
        updateSchoolAdminDto,
        city,
        session,
      );
      this.logger.log(`updated SchoolAdmin ${schoolAdmin}`);
      const user = await this.userService.updateDirectly(
        schoolAdmin.user_id,
        updateSchoolAdminDto,
        session,
      );
      this.logger.log(`updated user ${user}`);
      const address = await this.addressService.updateDirectly(
        user.address_id,
        updateSchoolAdminDto,
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

  async updateDirectly(userAddressId, reqBody, city, session) {
    return await this.schoolAdminModel.findByIdAndUpdate(
      userAddressId,
      {
        $set: {
          address_details: reqBody.address_details,
          area_name: reqBody.area_name,
          location: {
            type: 'Point',
            coordinates: [-122.5, 37.7],
          },
          city_id: city._id,
          updated_at: Date.now(),
        },
      },
      { session, new: true, runValidators: true },
    );
  }

  async deleteByAdmin(req, res) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      const schoolAdmin = await this.schoolAdminModel.findByIdAndRemove(
        req.params.id,
        {
          session,
        },
      );
      if (!schoolAdmin)
        return Util.getBadRequest('SchoolAdmin Not Found with given id', res);
      this.logger.log('SchoolAdmin Successfully Deleted');
      const user = await this.userModel.findByIdAndRemove(schoolAdmin.user_id, {
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
      return Util.getSimpleOkRequest('SchoolAdmin Successfully deleted', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async createByAdmin(
    updateSchoolAdminDto: UpdateSchoolAdminDto,
    res: Response,
  ) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      if (
        await this.userService.checkUserAlreadyRegisteredOrNot(
          updateSchoolAdminDto.user_name,
        )
      )
        return Util.getBadRequest('User already registered', res);
      this.logger.log('user not registered');
      const city = await this.cityService.checkCityExistOrNot(
        updateSchoolAdminDto.city_id,
      );
      if (!city) return Util.getBadRequest('City Not Found', res);
      this.logger.log('city found');
      const role = await this.rolesService.getRole(RoleType.SCHOOL_ADMIN);
      if (!role) return Util.getBadRequest('Role Not Found', res);
      this.logger.log('role found');
      const address = await this.addressService.createAndSave(
        updateSchoolAdminDto,
        city,
        session,
      );
      this.logger.log('User Address Created Successfully');
      const user = await this.userService.createAndSave(
        updateSchoolAdminDto,
        role,
        address,
        UserType.SCHOOL_ADMIN,
        session,
      );
      this.logger.log('SchoolAdmin User Created Successfully');
      const schoolAdmin = await this.createAndSave(
        updateSchoolAdminDto,
        user,
        city,
        session,
      );
      await session.commitTransaction();
      this.logger.log('SchoolAdmin Created Successfully');
      return Util.getSimpleOkRequest('SchoolAdmin Created Successfully', res);
    } catch (ex) {
      this.logger.log('Error While Creating School Admin ' + ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
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

  async save(schoolAdminObj, session) {
    this.logger.log('creating new SchoolAdmin');
    const schoolAdmin = new this.schoolAdminModel(schoolAdminObj);
    this.logger.log('saving SchoolAdmin...');
    return await schoolAdmin.save({ session });
  }

  async checkSchoolAdminExistOrNot(schoolAdminId) {
    this.logger.log('checking if school admin exists or not?');
    return await this.schoolAdminModel.findOne({ _id: schoolAdminId });
  }

  async removeSchool(id, session) {
    return await this.schoolAdminModel.findByIdAndUpdate(
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

  async addSchool(id, reqBody, session, school) {
    return await this.schoolAdminModel.findByIdAndUpdate(
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
}
