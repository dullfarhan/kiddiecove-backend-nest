import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import Debug from 'debug';
import Util from 'src/utils/util';
// const this.logger.log = Debug('app:services:teacher');
import {
  TeacherDocument,
  Teacher,
  UserDocument,
  User,
  Address,
  AddressDocument,
} from 'src/Schemas';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { Request, Response } from 'express';
import CurrentUser from 'src/currentuser/currentuser.service';
import Constant from 'src/utils/enums/Constant.enum';
import { UserType } from 'src/utils/enums/UserType.enum';
import { UserService } from 'src/user/user.service';
import { AddressService } from 'src/address/address.service';
import { RolesService } from 'src/roles/roles.service';
import { SchoolService } from 'src/school/school.service';
import { CityService } from 'src/city/city.service';
import { RoleType } from 'src/utils/enums/RoleType';

@Injectable()
export class TeacherService {
  pageNumber = 1;
  pageSize = 10;
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Teacher.name) private TeacherModel: Model<TeacherDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Address.name) private AddressModel: Model<AddressDocument>,
    @Inject(forwardRef(() => CurrentUser))
    private readonly currentUser: CurrentUser,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly addressService: AddressService,
    private readonly rolesService: RolesService,
    private readonly schoolService: SchoolService,
    private readonly cityService: CityService,
  ) {}
  private readonly logger = new Logger(TeacherService.name);

  async getAllTeachers(
    req: Request,
    res: Response,
    filter: FilterQuery<TeacherDocument>,
    selects: any,
  ) {
    this.logger.log('getting teacher list');
    await this.TeacherModel.find(filter)
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .sort({ name: 1 })
      .select(selects)
      .then((result) => {
        this.logger.log(result);
        return Util.getOkRequest(
          result,
          'Teachers Listing Fetched Successfully',
          res,
        );
      })
      .catch((ex) => {
        this.logger.log(ex);
        return Util.getBadRequest(ex.message, res);
      });
  }
  async getTeacher(req, res, filter) {
    try {
      this.logger.log('checking if teacher with given id exist or not');
      const teacher = await this.TeacherModel.findOne(filter);
      if (!teacher)
        return Util.getBadRequest('Teacher Not Found with given id', res);
      this.logger.log('Teacher exist');
      this.logger.log('Teacher Details Fetched Succesfully');
      return Util.getOkRequest(
        teacher,
        'Teacher Details Fetched Successfully',
        res,
      );
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }
  async getAllTeachersForSchoolAdmin(req, res) {
    this.logger.log('getting Teachers list for school admin');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.SCHOOL_ADMIN,
      this.UserModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin = response.data;
    this.getAllTeachers(
      req,
      res,
      {
        enable: true,
        school_id: schoolAdmin.school_id,
      },
      {},
    );
  }
  async getTeacherForSchoolAdmin(req, res) {
    this.logger.log('getting Teacher detail for school admin');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.SCHOOL_ADMIN,
      this.UserModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin = response.data;
    this.getTeacher(req, res, {
      enable: true,
      _id: req.params.id,
      school_id: schoolAdmin.school_id,
    });
  }

  async createTeacher(req, res, schoolId) {
    //Joi validation checking
    const session = await this.connection.startSession();
    this.logger.log('validating req body');
    // const { error } = validateTeacher(req.body);
    // if (error) return Util.getBadRequest(error.details[0].message, res);
    this.logger.log('req body is valid');
    try {
      session.startTransaction();
      const dd = await this.userService.checkUserAlreadyRegisteredOrNot(
        req.body.user_name,
      );
      console.log(dd);
      if (
        await this.userService.checkUserAlreadyRegisteredOrNot(
          req.body.user_name,
        )
      ) {
        console.log('under if');
        return Util.getBadRequest('User already registered', res);
      }
      this.logger.log('user not registered');
      const city = await this.cityService.checkCityExistOrNot(req.body.city_id);
      if (!city) return Util.getBadRequest('City Not Found', res);
      this.logger.log('city found');
      const school = await (
        await this.schoolService.checkSchoolExistOrNot(schoolId)
      ).toObject();
      // console.log(school);
      if (!school) return Util.getBadRequest('School Not Found', res);
      // console.log(school);
      this.logger.log('School found');
      const role = await this.rolesService.getRole(RoleType.TEACHER);
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
        UserType.TEACHER,
        session,
      );
      this.logger.log('Teacher User Created Successfully');
      const teacher = await this.createAndSave(
        req.body,
        user,
        city,
        school,
        session,
      );
      await session.commitTransaction();
      this.logger.log('Teacher Created Successfully');
      // const token = user.generateAuthToken()
      return Util.getSimpleOkRequest('Teacher Created Successfully', res);
    } catch (ex) {
      this.logger.log('Error While Creating Admin ' + ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async createTeacherByAdmin(req, res) {
    this.logger.log('admin is creating teacher');
    return await this.createTeacher(req, res, req.body.school_id);
  }

  async createTeacherBySchoolAdmin(req, res) {
    this.logger.log('school admin is creating teacher');
    //Checking Current User
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.SCHOOL_ADMIN,
      this.UserModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin = response.data;
    return await this.createTeacher(req, res, schoolAdmin.school_id);
  }

  async updateTeacher(req, res, schoolId) {
    const session = await this.connection.startSession();
    this.logger.log('validating req body');
    // const { error } = validateTeacher(req.body);
    // if (error) return Util.getBadRequest(error.details[0].message, res);
    this.logger.log('req body is valid');
    try {
      session.startTransaction();
      const teacher = await this.TeacherModel.findOne({ _id: req.params.id });
      if (!teacher)
        return Util.getBadRequest('Teacher Not Found with given id', res);
      this.logger.log('Teacher found');
      const city = await this.cityService.checkCityExistOrNot(req.body.city_id);
      if (!city) return Util.getBadRequest('City Not Found with given id', res);
      this.logger.log('city found');
      const school = await (
        await this.schoolService.checkSchoolExistOrNot(schoolId)
      ).toObject();
      if (!school) return Util.getBadRequest('School Not Found', res);
      this.logger.log('School found');
      const user = await this.UserModel.findOne({ _id: teacher.user_id });
      if (!user) return Util.getBadRequest('User Not Found with given id', res);
      this.logger.log('user found');
      const address = await this.AddressModel.findOne({ _id: user.address_id });
      if (!address)
        return Util.getBadRequest('Address Not Found with given id', res);
      this.logger.log('address found');
      if (req.url.includes('directly')) {
        await this.updateDirectlyWrapper(req, city, school, session);
        this.logger.log(`teacher directly updated successfully`);
      } else {
        await this.update(req, address, city, school, user, teacher, session);
        this.logger.log(`teacher updated successfully`);
      }
      await session.commitTransaction();
      this.logger.log('Teacher and Teacher User Updated Successfully');
      return Util.getSimpleOkRequest('Teacher Successfully Updated', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async update(req, address, city, school, user, teacher, session) {
    await this.addressService.updateAddress(address, req.body, city, session);
    this.logger.log(`updated address ${address}`);
    await this.userService.updateUser(user, req.body, session);
    this.logger.log(`updated user ${user}`);
    return await this.updateAndSaveTeacher(
      teacher,
      req.body,
      city,
      school,
      session,
    );
  }

  async save(teacherObj, session) {
    console.log(teacherObj);
    this.logger.log('creating new teacher');
    const teacher = new this.TeacherModel(teacherObj);
    this.logger.log('saving teacher...');
    return await teacher.save({ session });
  }

  async createAndSave(reqBody, user, city, school, session) {
    console.log(`school is this ${school}`);

    return await this.save(
      {
        _id: new mongoose.Types.ObjectId(),
        name: reqBody.name,
        designation: reqBody.designation,
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

  async setTeacherAndSave(teacher, teacherObj, session) {
    await teacher.set(teacherObj);
    this.logger.log('updating teacher');
    await teacher.save({ session });
  }
  async updateTeacherByAdmin(req, res) {
    this.logger.log('Admin is updating Teacher Details');
    return await this.updateTeacher(req, res, req.body.school_id);
  }
  async getAllTeachersAsListingForSchoolAdmin(req, res) {
    this.logger.log('getting Teachers listing for school admin');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.SCHOOL_ADMIN,
      this.UserModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin = response.data;
    this.getAllTeachers(
      req,
      res,
      {
        enable: true,
        school_id: schoolAdmin.school_id,
      },
      { _id: 1, name: 1 },
    );
  }
  async updateTeacherBySchoolAdmin(req, res) {
    this.logger.log('School Admin is updating Teacher Details');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.SCHOOL_ADMIN,
      this.UserModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin = response.data;
    return await this.updateTeacher(req, res, schoolAdmin.school_id);
  }

  async updateDirectlyWrapper(req, city, school, session) {
    const teacher = await this.updateDirectly(
      req.params.id,
      req.body,
      city,
      school,
      session,
    );
    this.logger.log(`updated teacher ${teacher}`);
    const user = await this.userService.updateDirectly(
      teacher.user_id,
      req.body,
      session,
    );
    this.logger.log(`updated user ${user}`);
    return await this.addressService.updateDirectly(
      user.address_id,
      req.body,
      city,
      session,
    );
  }

  async updateDirectly(id, reqBody, city, school, session) {
    return await this.TeacherModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: reqBody.name,
          designation: reqBody.designation,
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

  async updateAndSaveTeacher(teacher, reqBody, city, school, session) {
    return await this.setTeacherAndSave(
      teacher,
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
  async deleteTeacherByAdmin(req, res) {
    this.logger.log('Admin is deleting Teacher');
    return await this.deleteTeacher(req, res);
  }

  async deleteTeacherBySchoolAdmin(req, res) {
    this.logger.log('School Admin is deleting Teacher');
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.SCHOOL_ADMIN,
      this.UserModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin = response.data;
    const teacher = await this.checkTeacherExistenceWithSchool(
      req.params.id,
      schoolAdmin.school_id,
    );
    if (!teacher)
      return Util.getBadRequest('Teacher Does not Belong To this School', res);
    return await this.deleteTeacher(req, res);
  }

  async deleteTeacher(req, res) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const teacher = await this.TeacherModel.findByIdAndRemove(req.params.id, {
        session,
      });
      if (!teacher)
        return Util.getBadRequest('Teacher Not Found with given id', res);
      this.logger.log('Teacher Successfully Deleted');
      const user = await this.UserModel.findByIdAndRemove(teacher.user_id, {
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
      return Util.getSimpleOkRequest('Teacher Successfully deleted', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async checkTeacherExistOrNot(teacherId) {
    this.logger.log('checking teacher exist or not');
    return await this.TeacherModel.findOne({ _id: teacherId });
  }

  async getCurrentTeacher(userId) {
    this.logger.log('getting current teacher');
    return await this.TeacherModel.findOne({ user_id: userId });
  }

  async checkTeacherExistenceWithSchool(teacherId, schoolId) {
    this.logger.log('checking school existence with teacher');
    return await this.TeacherModel.findOne({
      _id: teacherId,
      school_id: schoolId,
    });
  }
  async getTeacherUserForSchoolAdmin(req, res): Promise<any> {
    const response = await this.currentUser.getCurrentUser(
      req,
      UserType.SCHOOL_ADMIN,
      this.UserModel,
    );
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin = response.data;
    const filter = {
      enable: true,
      school_id: schoolAdmin.school_id,
    };
    this.logger.log('checking if teacher with given id exist or not');
    return await this.TeacherModel.find(filter)
      .then((teacher) => {
        if (!teacher) {
          return Util.getBadRequest('Teacher Not Found with given id', res);
        }
        this.logger.log('Teacher exist');
        this.logger.log('Teacher Details Fetched Succesfully');
        return teacher;
})
      .catch((ex) => {
        this.logger.log(ex);
        return ex.message;
      });
  }
}
