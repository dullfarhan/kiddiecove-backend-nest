import { User, UserDocument } from 'src/Schemas';
import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { UserType } from 'src/utils/enums/UserType.enum';
import { SchoolAdminService } from 'src/school-admin/school-admin.service';
import { ParentService } from 'src/parent/parent.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { AdminService } from 'src/admin/admin.service';
import Util from 'src/utils/util';

@Injectable()
class CurrentUser {
  constructor(
    private readonly schoolAdminService: SchoolAdminService,
    private readonly teacherService: TeacherService,
    private readonly adminService: AdminService,
    private readonly parentService: ParentService,
  ) {}

  logger: Logger = new Logger(CurrentUser.name);

  async getCurrentUser(
    req: any,
    userType: UserType,
    userModel: Model<UserDocument>,
  ) {
    try {
      let currentUser;
      console.log('hello' + userType);
      this.logger.log('user id is ' + req.user._id);
      const user = await userModel.findById(req.user._id).select('-password');
      if (!user) Util.getBadResponse('Current User Not Found with given id');
      this.logger.log('Current User Details Fetched Succesfully');
      if (user.type !== userType)
        return Util.getBadResponse('Current User Is Not ' + userType);
      this.logger.log('Current User is ' + userType);
      switch (user.type) {
        case 'ADMIN':
          currentUser = await this.adminService.getCurrentAdmin(user._id);
          break;
        case 'SCHOOL_ADMIN':
          currentUser = await this.schoolAdminService.getCurrentSchoolAdmin(
            user._id,
          );
          break;
        case 'PARENT':
          currentUser = await this.parentService.getCurrentParent(user._id);
          break;
        case 'TEACHER':
          currentUser = await this.teacherService.getCurrentTeacher(user._id);
          break;
        default:
          return Util.getBadResponse('Current User Is Not ' + userType);
      }
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

  async getCurrentUserDetails(req, userModel: Model<UserDocument>) {
    try {
      console.log('User from request', req.user);
      const user = await userModel
        .findById(req.user._id)
        .select('-password')
        .populate('address_id')
        .exec();
      console.log(user);
      if (!user) Util.getBadResponse('Current User Not Found with given id');
      return Util.getOkResponse(
        user,
        'Current User Self Details Fetched Succesfully',
      );
    } catch (ex) {
      return Util.getBadResponse(ex.message);
    }
  }
}
export default CurrentUser;
