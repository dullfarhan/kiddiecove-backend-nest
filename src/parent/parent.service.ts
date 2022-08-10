import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { UserType } from 'src/utils/enums/UserType';
import Constant from 'src/utils/enums/Constant.enum';
import Util from 'src/utils/util';
import { CreateParentDto } from './dto/create-parent.dto';
import { RequestParentDto } from './dto/request-parent.dto';
import { CityService } from 'src/city/city.service';
import { UserService } from 'src/user/user.service';
import { AddressService } from 'src/address/address.service';
import { SchoolService } from 'src/school/school.service';
import { RolesService } from 'src/roles/roles.service';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  User,
  UserDocument,
  Address,
  AddressDocument,
  Parent,
  ParentDocument,
} from 'src/Schemas';
// import CustomParentSchool from 'src/Schemas/customParentSchool.schema';
import { RoleType } from 'src/utils/enums/RoleType';
import { GenderType } from 'src/utils/enums/GenderType';
import { ParentType } from 'src/utils/enums/ParentType';
import { RegistartionStatus } from 'src/utils/enums/RegistartionStatus';
import CurrentUser from 'src/currentuser/currentuser.service';
import { KidService } from 'src/kid/kid.service';
// import UserType from 'src/utils/enums/UserType.enum';

// mongo req return no data
@Injectable()
export class ParentService {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: Model<UserDocument>,
    @InjectModel(Address.name)
    private readonly AddressModel: Model<AddressDocument>,
    @InjectModel(Parent.name)
    private readonly ParentModel: Model<ParentDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly cityService: CityService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly addressService: AddressService,
    private readonly rolesService: RolesService,
    @Inject(forwardRef(() => CurrentUser))
    private readonly currentUser: CurrentUser,
    private readonly kidService: KidService,
    private readonly schoolService: SchoolService,
  ) {}
  pageNumber = 1;
  pageSize = 10;
  private readonly logger = new Logger(ParentService.name);
  getAllParents(req, res, filter) {
    this.logger.log('getting Parents list');
    this.ParentModel.aggregate(filter)
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ name: 1 })
      .then((result) => {
        this.logger.log(result);
        return Util.getOkRequest(
          result,
          'Parents Listing Fetched Successfully',
          res,
        );
      })
      .catch((ex) => {
        this.logger.log(ex);
        return Util.getBadRequest(ex.message, res);
      });
  }

  getAllParentsForAdmin(req, res) {
    this.logger.log('getting Parents list for admin');
    this.getAllParents(req, res, [
      { $match: { enable: true } },
      { $unwind: '$schools' },
      {
        $match: {
          'schools.registration_status': req.query.registration_status,
        },
      },
      {
        $project: {
          name: 1,
          type: 1,
          user: 1,
          enable: 1,
          deleted: 1,
          schools: 1,
        },
      },
    ]);
  }

  async getAllParentsForSchoolAdmin(req, res) {
    this.logger.log('getting parents list for school admin');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.SCHOOL_ADMIN,
      this.UserModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin = response.data;
    this.getAllParents(req, res, [
      { $match: { enable: true } },
      { $unwind: '$schools' },
      {
        $match: {
          'schools.school_id': schoolAdmin.school_id,
          'schools.registration_status': req.query.registration_status,
        },
      },
      {
        $project: {
          name: 1,
          type: 1,
          user: 1,
          enable: 1,
          deleted: 1,
          schools: 1,
        },
      },
    ]);
  }

  async getParent(req, res, filter) {
    try {
      this.logger.log('checking if Parent with given id exist or not');
      const parent = await this.ParentModel.aggregate(filter);
      console.log({ parent });
      if (!parent)
        return Util.getBadRequest('Parent Not Found with given id', res);
      this.logger.log('Parent exist');
      this.logger.log('Parent Details Fetched Succesfully');
      console.log(parent);
      return Util.getOkRequest(
        parent,
        'Parent Details Fetched Successfully',
        res,
      );
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async getParentForAdmin(req, res) {
    const id = new mongoose.Types.ObjectId(req.params.id);
    this.logger.log('getting Parent detail for admin');
    this.getParent(req, res, [
      { $match: { enable: true, _id: id } },
      { $unwind: '$schools' },
      {
        $match: {
          'schools.registered': true,
        },
      },
      {
        $project: {
          name: 1,
          enable: 1,
          type: 1,
          _id: 1,
          user: 1,
          user_id: 1,
          create_at: 1,
          updated: 1,
          schools: 1,
        },
      },
    ]);
  }

  async getParentForSchoolAdmin(req, res) {
    this.logger.log('getting Parent detail for school admin');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.SCHOOL_ADMIN,
      this.UserModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin = response.data;
    const id = new mongoose.Types.ObjectId(req.params.id);
    this.getParent(req, res, [
      { $match: { enable: true, _id: id } },
      { $unwind: '$schools' },
      {
        $match: {
          'schools.school_id': schoolAdmin.school_id,
          'schools.registered': true,
        },
      },
      {
        $project: {
          name: 1,
          enable: 1,
          type: 1,
          _id: 1,
          user: 1,
          user_id: 1,
          create_at: 1,
          updated: 1,
          schools: 1,
        },
      },
    ]);
  }

  async getSelfDetailsForParent(req, res) {
    this.logger.log('getting self details for parent');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.PARENT,
      this.UserModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current Parent User Found');
    return Util.getOkRequest(response.data, 'Current Parent User Found', res);
  }

  async updateByParent(req, res) {
    const session = await this.connection.startSession();
    this.logger.log('validating req body');
    this.logger.log('req body is valid');
    try {
      session.startTransaction();
      this.logger.log('getting current parent user details');
      const response = await this.currentUser.getCurrentUser(
        req,
        UserType.PARENT,
        this.UserModel,
      );
      if (response.status === Constant.FAIL)
        return Util.getBadRequest(response.message, res);
      this.logger.log('Current Parent User Found');
      const parent = response.data;
      const city = await this.cityService.checkCityExistOrNot(req.body.city_id);
      if (!city) return Util.getBadRequest('City Not Found with given id', res);
      this.logger.log('city found');
      const user = await this.UserModel.findOne({ _id: parent.user_id });
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
      await this.updateAndSaveParent(parent, req.body, city, session);
      this.logger.log(`updated Parent ${parent}`);
      await session.commitTransaction();
      this.logger.log('Parent and Parent User Updated Successfully');
      return Util.getSimpleOkRequest('Parent Successfully Updated', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async updateDirectlyByParent(req, res) {
    const session = await this.connection.startSession();
    this.logger.log('validating req body');
    // const { error } = validateParent(req.body);
    // if (error) return Util.getBadRequest(error.details[0].message, res);
    this.logger.log('req body is valid');
    try {
      session.startTransaction();
      this.logger.log('getting current parent user details');
      const response = await this.currentUser.getCurrentUser(
        req,
        UserType.PARENT,
        this.UserModel,
      );
      if (response.status === Constant.FAIL)
        return Util.getBadRequest(response.message, res);
      this.logger.log('Current Parent User Found');
      let parent = response.data;
      const city = await this.cityService.checkCityExistOrNot(req.body.city_id);
      if (!city) return Util.getBadRequest('City Not Found', res);
      this.logger.log('city found');
      parent = await this.updateDirectly(parent._id, req.body, city, session);
      this.logger.log(`updated Parent ${parent}`);
      const user = await this.userService.updateDirectly(
        parent.user_id,
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
      this.logger.log('Parent and Parent User Updated Successfully');
      return Util.getSimpleOkRequest('Parent Successfully Updated', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async deleteByParent(req, res) {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      const parent = await this.ParentModel.findByIdAndRemove(req.params.id, {
        session,
      });
      if (!parent)
        return Util.getBadRequest('Parent Not Found with given id', res);
      this.logger.log('Parent Successfully Deleted');
      const user = await this.UserModel.findByIdAndRemove(parent.user_id, {
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
      if (parent._id) {
        this.kidService.deleteAllSiblingsInSchool(parent._id);
      }
      if (!address)
        return Util.getBadRequest('Address Not Found with given id', res);
      this.logger.log('Address Successfully Deleted');
      await session.commitTransaction();
      return Util.getSimpleOkRequest('Parent Successfully deleted', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async deleteByAdmin(req, res) {
    const session = await this.connection.startSession();
    const schoolId = new mongoose.Types.ObjectId(req.query.school_id);
    const parentId = new mongoose.Types.ObjectId(req.params.id);
    try {
      session.startTransaction();
      const parent = await this.removeSchool(parentId, schoolId, session);
      if (!parent)
        return Util.getBadRequest('Failed To Delete Parent From School', res);
      else {
        this.logger.log('Parent found!');
      }
      await this.kidService.removeSchoolDueToParentRemoval(
        parentId,
        schoolId,
        session,
      );
      this.logger.log('Parent Successfully Deleted From School');
      await session.commitTransaction();
      return Util.getSimpleOkRequest(
        'Parent Successfully deleted From School',
        res,
      );
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async deleteBySchoolAdmin(req, res) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const response = await this.currentUser.getCurrentUser(
        req,
        UserType.SCHOOL_ADMIN,
        this.UserModel,
      );
      if (response.status === Constant.FAIL)
        return Util.getBadRequest(response.message, res);
      this.logger.log('Current School Admin User Found');
      const schoolAdmin = response.data;
      if (schoolAdmin.registered !== true)
        return Util.getBadRequest('School Admin Not Registered', res);
      this.logger.log('School Admin is registered');
      let parent = await this.checkParentExistenceWithSchool(
        req.params.id,
        schoolAdmin.school_id,
      );
      if (!parent)
        return Util.getBadRequest('Parent Not Exist With This School', res);
      parent = await this.removeSchool(
        parent.id,
        schoolAdmin.school_id,
        session,
      );
      if (!parent)
        return Util.getBadRequest('Failed To Delete Parent From School', res);
      await this.kidService.removeSchoolDueToParentRemoval(
        parent._id,
        schoolAdmin.school_id,
        session,
      );
      this.logger.log('Parent Successfully Deleted From School');
      await session.commitTransaction();
      return Util.getSimpleOkRequest(
        'Parent Successfully deleted From School',
        res,
      );
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async removeSchool(id, schoolId, session) {
    return await this.ParentModel.findByIdAndUpdate(
      id,
      {
        $pull: {
          schools: {
            school_id: schoolId,
          },
        },
        $set: {
          updated_at: Date.now(),
        },
      },
      { session, new: true },
    );
  }

  async createParentByAdmin(req, res) {
    //Joi validation checking
    console.log(JSON.stringify(req.body, null, 4));
    const session = await this.connection.startSession();
    this.logger.log('validating req body');
    // const { error } = validateParent(req.body);
    // if (error) return Util.getBadRequest(error.details[0].message, res);
    this.logger.log('req body is valid');
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
      const role = await this.rolesService.getRole(RoleType.PARENT);
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
        UserType.PARENT,
        session,
      );
      this.logger.log('Parent User Created Successfully');
      const parent = await this.createAndSave(req.body, user, city, session);
      await session.commitTransaction();
      this.logger.log('Parent Created Successfully');
      // const token = user.generateAuthToken()
      return Util.getSimpleOkRequest('Parent Created Successfully', res);
    } catch (ex) {
      this.logger.log('Error While Creating Admin ' + ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async requestToJoin(req, res) {
    const session = await this.connection.startSession();
    this.logger.log('validating req body');
    this.logger.log(JSON.stringify(req.body, null, 4));
    // const { error } = validateParentRequest(req.body);
    // if (error) return Util.getBadRequest(error.details[0].message, res);
    this.logger.log('req body is valid');
    try {
      session.startTransaction();
      const response = await this.currentUser.getCurrentUser(
        req,
        UserType.PARENT,
        this.UserModel,
      );
      if (response.status === Constant.FAIL)
        return Util.getBadRequest(response.message, res);
      this.logger.log('Current Parent User Found');
      let parent = response.data;
      if (parent.schools.length == 0) this.logger.log('parent not registered');
      const school = await this.schoolService.checkSchoolExistOrNot(
        req.body.school_id,
      );
      if (!school) return Util.getBadRequest('School Not Found', res);
      const checkExistence = await this.checkParentExistenceWithSchool(
        parent._id,
        school._id,
      );

      const result = await this.kidService.updateStatusToPending(
        req,
        school,
        session,
      );
      console.log(result);

      if (checkExistence) {
        this.logger.log(
          'Parent Already requested for this school ' +
            JSON.stringify(checkExistence, null, 4),
        );
        return Util.getBadRequest(
          'Parent already requested for this school',
          res,
        );
      }

      let msg;
      for (const res in result) {
        msg = { ...msg, [res]: result[res] };
        if (result[res] === 'success') {
          parent = await this.updateStatusToPending(parent, school, session);
        }
      }

      await session.commitTransaction();
      return Util.getSimpleOkRequest(msg, res);
    } catch (ex) {
      this.logger.log('Error While Submitting Parent Request ' + ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async save(parentObj, session) {
    this.logger.log('creating new Parent');
    const parent = new this.ParentModel(parentObj);
    this.logger.log('saving Parent...');
    return await parent.save({ session });
  }

  async createAndSave(reqBody, user, city, session) {
    return await this.save(
      {
        _id: new mongoose.Types.ObjectId(),
        name: reqBody.name,
        type: reqBody.type,
        user: {
          _id: new mongoose.Types.ObjectId(),
          user_name: reqBody.user_name,
          gender:
            reqBody.type.toUpperCase() === ParentType.FATHER
              ? GenderType.MALE
              : GenderType.FEMALE,
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

  async setParentAndSave(parent, parentObj, session) {
    await parent.set(parentObj);
    this.logger.log('updating Parent');
    await parent.save({ session });
  }

  async checkParentExistenceWithSchool(parentId, schoolId) {
    this.logger.log(
      'checking if parent belongs to the school of current school admin user?',
    );
    return await this.ParentModel.findOne({
      $and: [
        { _id: parentId },
        { schools: { $elemMatch: { school_id: schoolId } } },
      ],
    });
  }
  async updateDirectly(id, reqBody, city, session) {
    return await this.ParentModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: reqBody.name,
          type: reqBody.type,
          updated_at: Date.now(),
          'user.email': reqBody.email,
          'user.gender':
            reqBody.type.toUpperCase() === ParentType.FATHER
              ? GenderType.MALE
              : GenderType.FEMALE,
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

  async updateStatusToPending(parent, school, session) {
    return await this.ParentModel.findByIdAndUpdate(
      parent._id,
      {
        $push: {
          schools: {
            school_id: school._id,
            school_name: school.name,
            registration_status: RegistartionStatus.PENDING,
            registered: false,
          },
        },
        $set: {
          updated_at: Date.now(),
          'user.updated_at': Date.now(),
        },
      },
      { session, new: true, runValidators: true },
    );
  }

  async updateStatusToRegisterBySchoolAdmin(parent, school, session) {
    return await this.ParentModel.findOneAndUpdate(
      { _id: parent._id, 'schools.school_id': school._id },
      {
        $set: {
          updated_at: Date.now(),
          'user.updated_at': Date.now(),
          'schools.$.registration_status': RegistartionStatus.REGISTERED,
          'schools.$.registered': true,
        },
      },
      { session, new: true, runValidators: true },
    );
  }

  async updateStatusToRegister(parentId, schoolId, session) {
    this.logger.log('school id is ' + schoolId);
    this.logger.log('parent id is ' + parentId);
    return await this.ParentModel.updateMany(
      {
        $and: [
          { _id: parentId },
          { schools: { $elemMatch: { school_id: schoolId } } },
        ],
      },
      {
        $set: {
          'schools.$[].registered': true,
          'schools.$[].registration_status': RegistartionStatus.REGISTERED,
        },
      },
      { session, new: true, runValidators: true },
    );
  }

  async updateAndSaveParent(parent, reqBody, city, session) {
    return await this.setParentAndSave(
      parent,
      {
        name: reqBody.name,
        type: reqBody.type,
        updated_at: Date.now(),
        'user.gender':
          reqBody.type.toUpperCase() === ParentType.FATHER
            ? GenderType.MALE
            : GenderType.FEMALE,
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

  async getCurrentParent(userId) {
    this.logger.log('getting current parent');
    return await this.ParentModel.findOne({ user_id: userId });
  }

  async checkParentExistOrNot(parentId) {
    this.logger.log('checking parent exist or not?');
    return await this.ParentModel.findOne({ _id: parentId });
  }
}
class School {
  schools: CustomParentSchool;
}
class CustomParentSchool {
  school_id: mongoose.Types.ObjectId;
  school_name: string;
  registration_status: string;
}
