import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { School } from 'src/Schemas';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import Debug from 'debug';

@Injectable()
export class SchoolService {
  serviceDebugger = Debug('app:services:school');
  constructor(
    @InjectModel(School.name) private readonly schoolModel: Model<School>,
  ) {}

  create(createSchoolDto: CreateSchoolDto) {
    return 'This action adds a new school';
  }

  findAll() {
    return `This action returns all school`;
  }

  findOne(id: number) {
    return `This action returns a #${id} school`;
  }

  update(id: number, updateSchoolDto: UpdateSchoolDto) {
    return `This action updates a #${id} school`;
  }

  remove(id: number) {
    return `This action removes a #${id} school`;
  }

  async checkSchoolExistOrNot(school_id) {
    this.serviceDebugger('checking if school exist or not');
    return await this.schoolModel.findOne({ _id: school_id });
  }
}
