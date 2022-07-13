import { Injectable, Logger } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import Debug from 'debug';
import Util from 'src/utils/util';
const serviceDebugger = Debug('app:services:teacher');
import { TeacherDocument, Teacher } from 'src/Schemas';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Request, Response } from 'express';
import { AppService } from 'src/app.service';
const pageNumber = 1;
const pageSize = 10;

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
  ) {}
  private readonly logger = new Logger(AppService.name);

  create(createTeacherDto: CreateTeacherDto) {
    return 'This action adds a new teacher';
  }
  getAllForAdmin() {}

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
    await this.teacherModel
      .find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ name: 1 })
      .select(selects)
      .then((result) => {
        // this.logger.log('hello');
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
}
