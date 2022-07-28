import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response, Request } from 'express';
import { Model } from 'mongoose';
import CurrentUser from 'src/currentuser/currentuser.service';
import {
  Parent,
  ParentDocument,
  School,
  SchoolAdmin,
  SchoolAdminDocument,
  SchoolDocument,
  Teacher,
  TeacherDocument,
  User,
  UserDocument,
} from 'src/Schemas';
import { SchoolAdminService } from 'src/school-admin/school-admin.service';
import Constant from 'src/utils/enums/Constant.enum';
import { UserType } from 'src/utils/enums/UserType.enum';
import Util from 'src/utils/util';

@Injectable()
export class StatService {
  private readonly logger: Logger = new Logger(StatService.name);

  constructor(
    @InjectModel(School.name)
    private readonly schoolModel: Model<SchoolDocument>,
    @InjectModel(SchoolAdmin.name)
    private readonly schoolAdminModel: Model<SchoolAdminDocument>,
    @InjectModel(Parent.name)
    private readonly parentModel: Model<ParentDocument>,
    @InjectModel(Teacher.name)
    private readonly teacherModel: Model<TeacherDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly currentUser: CurrentUser,
  ) {}

  async getStatsForAdmin(res: Response) {
    try {
      const schools = await this.schoolModel.find().count();
      const schoolAdmins = await this.schoolAdminModel.find().count();
      const parents = await this.parentModel.find().count();
      const teachers = await this.teacherModel.find().count();
      return Util.getOkRequest(
        {
          schools,
          schoolAdmins,
          parents,
          teachers,
        },
        'Stats Fetched Successfully',
        res,
      );
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }

  async getStatsForSchoolAdmin(req: Request, res: Response) {
    try {
      const response = await this.currentUser.getCurrentUser(
        req,
        UserType.SCHOOL_ADMIN,
        this.userModel,
      );
      if (response.status === Constant.FAIL)
        return Util.getBadRequest(response.message, res);
      this.logger.log('Current School Admin User Found');
      const schoolAdmin = response.data;
      const parents = await this.parentModel.aggregate([
        { $match: { enable: true } },
        { $unwind: '$schools' },
        {
          $match: {
            'schools.school_id': schoolAdmin.school_id,
          },
        },
        {
          $group: {
            _id: null,
            count: {
              $sum: 1,
            },
          },
        },
      ]);
      const teachers = await this.teacherModel
        .find({
          school_id: schoolAdmin.school_id,
        })
        .count();
      return Util.getOkRequest(
        {
          parents: parents[0] ? parents[0].count : 0,
          teachers,
        },
        'Stats Fetched Successfully',
        res,
      );
    } catch (ex) {
      this.logger.log(ex);
      return Util.getBadRequest(ex.message, res);
    }
  }
}
