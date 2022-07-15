import { Injectable, Logger } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import Debug from 'debug';
import Util from 'src/utils/util';
const serviceDebugger = Debug('app:services:teacher');
import { TeacherDocument, Teacher } from 'src/Schemas';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { Request, Response } from 'express';
import { AppService } from 'src/app.service';
import Constant from 'src/utils/Constant';
import { UserType } from 'src/utils/enums/UserType.enum';
const pageNumber = 1;
const pageSize = 10;

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name) private TeacherModel: Model<TeacherDocument>,
  ) {}
  private readonly logger = new Logger(AppService.name);

  create(createTeacherDto: CreateTeacherDto) {
    return 'This action adds a new teacher';
  }
  // getAllForAdmin() {}

  findAll() {
    return `This action returns all teacher`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teacher`;
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return `This action updates a #${id} teacher`;
  }

  remove(id: number) {
    return `This action removes a #${id} teacher`;
  }

  async getAllTeachers(
    req: Request,
    res: Response,
    filter: FilterQuery<TeacherDocument>,
    selects: any,
  ) {
    serviceDebugger('getting teacher list');
    await this.TeacherModel.find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ name: 1 })
      .select(selects)
      .then((result) => {
        serviceDebugger(result);
        return Util.getOkRequest(
          result,
          'Teachers Listing Fetched Successfully',
          res,
        );
      })
      .catch((ex) => {
        serviceDebugger(ex);
        return Util.getBadRequest(ex.message, res);
      });
  }

  // async createTeacher(req, res, schoolId) {
  //   //Joi validation checking
  //   const session = await mongoose.startSession();
  //   serviceDebugger('validating req body');
  //   const { error } = validateTeacher(req.body);
  //   if (error) return Util.getBadRequest(error.details[0].message, res);
  //   serviceDebugger('req body is valid');
  //   try {
  //     session.startTransaction();

  //     if (await userService.checkUserAlreadyRegisteredOrNot(req.body.user_name))
  //       return Util.getBadRequest('User already registered', res);
  //     serviceDebugger('user not registered');
  //     const city = await cityService.checkCityExistOrNot(req.body.city_id);
  //     if (!city) return Util.getBadRequest('City Not Found', res);
  //     serviceDebugger('city found');
  //     const school = await schoolService.checkSchoolExistOrNot(schoolId);
  //     if (!school) return Util.getBadRequest('School Not Found', res);
  //     serviceDebugger('School found');
  //     const role = await rolesService.getRole(RoleType.TEACHER);
  //     if (!role) return Util.getBadRequest('Role Not Found', res);
  //     serviceDebugger('role found');
  //     const address = await addressService.createAndSave(
  //       req.body,
  //       city,
  //       session,
  //     );
  //     serviceDebugger('User Address Created Successfully');
  //     const user = await userService.createAndSave(
  //       req.body,
  //       role,
  //       address,
  //       UserType.TEACHER,
  //       session,
  //     );
  //     serviceDebugger('Teacher User Created Successfully');
  //     const teacher = await createAndSave(
  //       req.body,
  //       user,
  //       city,
  //       school,
  //       session,
  //     );
  //     await session.commitTransaction();
  //     serviceDebugger('Teacher Created Successfully');
  //     // const token = user.generateAuthToken()
  //     return Util.getSimpleOkRequest('Teacher Created Successfully', res);
  //   } catch (ex) {
  //     serviceDebugger('Error While Creating Admin ' + ex);
  //     await session.abortTransaction();
  //     return Util.getBadRequest(ex.message, res);
  //   } finally {
  //     session.endSession();
  //   }
  // }

  // async createTeacherByAdmin(req, res) {
  //   serviceDebugger('admin is creating teacher');
  //   // return await createTeacher(req, res, req.body.school_id);
  // }

  // async createTeacherBySchoolAdmin(req, res) {
  //   serviceDebugger('school admin is creating teacher');
  //   //Checking Current User
  //   const response = await CurrentUser.getCurrentUser(
  //     req,
  //     UserType.SCHOOL_ADMIN,
  //   );
  //   if (response.status === Constant.FAIL)
  //     return Util.getBadRequest(response.message, res);
  //   serviceDebugger('Current School Admin User Found');
  //   const schoolAdmin = response.data;
  //   return await createTeacher(req, res, schoolAdmin.school_id);
  // }

  async save(teacherObj, session) {
    serviceDebugger('creating new teacher');
    const teacher = new this.TeacherModel(teacherObj);
    serviceDebugger('saving teacher...');
    return await teacher.save({ session });
  }

  async createAndSave(reqBody, user, city, school, session) {
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
    serviceDebugger('updating teacher');
    await teacher.save({ session });
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

  async checkTeacherExistOrNot(teacherId) {
    serviceDebugger('checking teacher exist or not');
    return await this.TeacherModel.findOne({ _id: teacherId });
  }

  async getCurrentTeacher(userId) {
    serviceDebugger('getting current teacher');
    return await this.TeacherModel.findOne({ user_id: userId });
  }

  async checkTeacherExistenceWithSchool(teacherId, schoolId) {
    serviceDebugger('checking school existence with teacher');
    return await this.TeacherModel.findOne({
      _id: teacherId,
      school_id: schoolId,
    });
  }
}
