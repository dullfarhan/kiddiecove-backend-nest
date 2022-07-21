import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { SchoolAdmin, SchoolAdminDocument } from 'src/Schemas';
import Util from 'src/utils/util';
import { CreateSchoolAdminDto } from './dto/create-school-admin.dto';
import { UpdateSchoolAdminDto } from './dto/update-school-admin.dto';

@Injectable()
export class SchoolAdminService {
  private pageNumber = 1;
  private pageSize = 10;
  private readonly logger: Logger = new Logger('School Admin Service');
  constructor(
    @InjectModel(SchoolAdmin.name)
    private readonly schoolAdminModel: Model<SchoolAdminDocument>,
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
}
