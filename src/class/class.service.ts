import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import mongoose, { Model, Mongoose } from 'mongoose';
import { UserType } from 'src/utils/enums/UserType';
import { Class, ClassDocument, User, UserDocument } from 'src/Schemas';
import { SchoolAdminService } from 'src/school-admin/school-admin.service';
import { SchoolService } from 'src/school/school.service';
import { TeacherService } from 'src/teacher/teacher.service';
import Constant from 'src/utils/enums/Constant.enum';
import Util from 'src/utils/util';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassService {
  private readonly logger: Logger = new Logger(ClassService.name);

  pageNumber = 1;
  pageSize = 10;
  constructor(
    @InjectModel(Class.name)
    private readonly classModel: Model<ClassDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly schoolAdminService: SchoolAdminService,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly teacherService: TeacherService,
    private readonly schoolService: SchoolService,
  ) {}

  getAllClassesForAdmin(res) {
    this.logger.log('getting Classes list for admin');
    this.getAllClasses(
      res,
      { enable: true },
      { _id: 1, standard: 1, school_name: 1, teacher_name: 1, strenght: 1 },
    );
  }

  getAllClasses(res: Response, filter: Object, selects: Object) {
    this.logger.log('getting class list');
    this.classModel
      .find(filter)
      .skip((this.pageNumber - 1) * this.pageSize)
      .limit(this.pageSize)
      .select(selects)
      .then((result) => {
        this.logger.log(result);
        return Util.getOkRequest(
          result,
          'Class Listing Fetched Successfully',
          res,
        );
      })
      .catch((ex) => {
        this.logger.log(ex);
        return Util.getBadRequest(ex.message, res);
      });
  }

  async getAllClassesForSchoolAdmin(req: Request, res: Response) {
    this.logger.log('getting Classes list for school admin');
    const response = await this.getCurrentUser(req, UserType.SCHOOL_ADMIN);
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin: any = response.data;
    this.getAllClasses(
      res,
      {
        enable: true,
        school_id: schoolAdmin.school_id,
      },
      { _id: 1, standard: 1, school_name: 1, teacher_name: 1, strenght: 1 },
    );
  }

  async getCurrentUser(req, userType: string) {
    try {
      let currentUser;
      this.logger.log('user id is ' + req.user._id);
      const user = await this.userModel
        .findById(req.user._id)
        .select('-password');
      if (!user) Util.getBadResponse('Current User Not Found with given id');
      this.logger.log('Current User Details Fetched Succesfully');
      if (user.type !== userType)
        return Util.getBadResponse('Current User Is Not ' + userType);
      this.logger.log('Current User is ' + userType);

      currentUser = await this.schoolAdminService.getCurrentSchoolAdmin(
        user._id,
      );

      return !currentUser
        ? Util.getBadResponse('Current User Not Found')
        : Util.getOkResponse(
            currentUser,
            'Current User Details Fetched Succesfully',
          );
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadResponse(ex.message);
    }
  }

  getAllClassesAsListingForParent(id, res: Response) {
    this.logger.log('getting Classes list for parent');
    this.getAllClasses(
      res,
      {
        enable: true,
        school_id: id,
      },
      { _id: 1, standard: 1 },
    );
  }

  async getClassForAdmin(id: string, res: Response) {
    this.logger.log('getting Class detail for admin');
    this.getClass(res, { _id: id, enable: true });
  }

  async getClass(res: Response, filter: Object) {
    try {
      this.logger.log('checking if Class with given id exist or not');
      const standard = await this.classModel.findOne(filter);
      if (!standard)
        return Util.getBadRequest('Class Not Found with given id', res);
      this.logger.log('Class exist');
      this.logger.log('Class Details Fetched Succesfully');
      return Util.getOkRequest(
        standard,
        'Class Details Fetched Successfully',
        res,
      );
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async getClassForSchoolAdmin(id: string, req: Request, res: Response) {
    this.logger.log('getting Class detail for school admin');
    const response = await this.getCurrentUser(req, UserType.SCHOOL_ADMIN);
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin: any = response.data;
    this.getClass(res, {
      _id: id,
      enable: true,
      school_id: schoolAdmin.school_id,
    });
  }

  async updateClassByAdmin(
    id,
    updateClassDto: UpdateClassDto,
    res: Response,
    isDirect = false,
  ) {
    this.logger.log('Admin is updating Class directly');
    return await this.updateClass(
      id,
      updateClassDto,
      res,
      updateClassDto.school_id,
      isDirect,
    );
  }

  async updateClass(
    id: string,
    updateClassDto: UpdateClassDto,
    res: Response,
    schoolId: mongoose.Types.ObjectId,
    isDirect: boolean,
  ) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const teacher = await this.teacherService.checkTeacherExistenceWithSchool(
        updateClassDto.teacher_id,
        schoolId,
      );
      if (!teacher)
        return Util.getBadRequest(
          'Teacher Does not Belong To this School',
          res,
        );
      if (isDirect) {
        const standard = await this.updateDirectly(id, teacher, session);
        this.logger.log(`directly updated Class ${standard}`);
      } else {
        const standard = await this.classModel.findOne({ _id: id });
        if (!standard)
          return Util.getBadRequest('Class Not Found with given id', res);
        this.logger.log('Class found');
        await this.updateAndSaveClass(standard, teacher, session);
        this.logger.log(`updated Class ${standard}`);
      }
      await session.commitTransaction();
      this.logger.log('Class Updated Successfully');
      return Util.getSimpleOkRequest('Class Successfully Updated', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async updateDirectly(classId, teacher, session) {
    return await this.classModel.findByIdAndUpdate(
      classId,
      {
        $set: {
          teacher_id: teacher._id,
          teacher_name: teacher.name,
          updated_at: Date.now(),
        },
      },
      { session, new: true, runValidators: true },
    );
  }

  async updateAndSaveClass(standard, teacher, session) {
    return await this.setClassAndSave(
      standard,
      {
        teacher_id: teacher._id,
        teacher_name: teacher.name,
        updated_at: Date.now(),
      },
      session,
    );
  }

  async setClassAndSave(class_, classObj, session) {
    await class_.set(classObj);
    this.logger.log('updating Class');
    return await class_.save({ session });
  }

  async updateClassBySchoolAdmin(
    id,
    req: Request,
    updateClassDto: UpdateClassDto,
    res: Response,
    isDirect = false,
  ) {
    this.logger.log('School Admin is updating Class directly');
    const response = await this.getCurrentUser(req, UserType.SCHOOL_ADMIN);
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin: any = response.data;
    return await this.updateClass(
      id,
      updateClassDto,
      res,
      schoolAdmin.school_id,
      isDirect,
    );
  }

  async deleteClassByAdmin(req, res) {
    this.logger.log('Admin is deleting Class');
    return await this.deleteClass(req, res);
  }

  async deleteClass(id: string, res: Response) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const standard = await this.classModel.findByIdAndRemove(id, {
        session,
      });
      if (!standard)
        return Util.getBadRequest('Class Not Found with given id', res);
      this.logger.log('Class Successfully Deleted');
      await session.commitTransaction();
      return Util.getSimpleOkRequest('Class Successfully deleted', res);
    } catch (ex) {
      this.logger.log(ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async deleteClassBySchoolAdmin(id, req, res) {
    this.logger.log('School Admin is deleting Class');
    const response = await this.getCurrentUser(req, UserType.SCHOOL_ADMIN);
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin: any = response.data;
    const standard = await this.checkClassExistenceWithSchool(
      id,
      schoolAdmin.school_id,
    );
    if (!standard)
      return Util.getBadRequest('Class Does not Belong To this School', res);
    return await this.deleteClass(req, res);
  }

  async checkClassExistenceWithSchool(classId, schoolId) {
    this.logger.log('checking class existence with school');
    return await this.classModel.findOne({ _id: classId, school_id: schoolId });
  }

  async createClassByAdmin(updateClassDto, res) {
    this.logger.log('req body is valid');
    return await this.createClass(
      updateClassDto,
      res,
      updateClassDto.school_id,
      updateClassDto.teacher_id,
    );
  }

  async createClass(
    updateClassDto: UpdateClassDto,
    res: Response,
    schoolId: mongoose.Types.ObjectId,
    teacherId: mongoose.Types.ObjectId,
  ) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const school = await this.schoolService.checkSchoolExistOrNot(schoolId);
      if (!school) return Util.getBadRequest('School Not Found', res);
      this.logger.log('School found');
      const teacher = await this.teacherService.checkTeacherExistenceWithSchool(
        teacherId,
        school._id,
      );
      if (!teacher)
        return Util.getBadRequest('Teacher Not Found With This school', res);
      this.logger.log('teacher found');
      const standard = await this.createAndSave(
        updateClassDto,
        school,
        teacher,
        session,
      );
      await session.commitTransaction();
      this.logger.log('Class Created Successfully');
      return Util.getSimpleOkRequest('Class Created Successfully', res);
    } catch (ex) {
      this.logger.log('Error While Creating Class ' + ex);
      await session.abortTransaction();
      return Util.getBadRequest(ex.message, res);
    } finally {
      session.endSession();
    }
  }

  async createAndSave(updateClassDto, school, teacher, session) {
    this.logger.log('creating new class');
    return await this.save(
      {
        _id: new mongoose.Types.ObjectId(),
        standard: updateClassDto.standard,
        strenght: 0,
        school_id: school._id,
        school_name: school.name,
        teacher_id: teacher._id,
        teacher_name: teacher.name,
      },
      session,
    );
  }

  async save(classObj, session) {
    this.logger.log('creating new Class');
    const standard = new this.classModel(classObj);
    this.logger.log('saving Class...');
    return await standard.save({ session });
  }

  async createClassBySchoolAdmin(
    req: Request,
    updateClassDto: UpdateClassDto,
    res: Response,
  ) {
    this.logger.log('req body is valid');
    const response = await this.getCurrentUser(req, UserType.SCHOOL_ADMIN);
    if (response.status === Constant.FAIL)
      return Util.getBadRequest(response.message, res);
    this.logger.log('Current School Admin User Found');
    const schoolAdmin: any = response.data;
    return await this.createClass(
      updateClassDto,
      res,
      schoolAdmin.school_id,
      updateClassDto.teacher_id,
    );
  }
}
