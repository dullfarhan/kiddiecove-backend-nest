import { isString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateTeacherDto {
  // _id: mongoose.Types.ObjectId;

  @isString()
  name: string;
  code: string;
  country_id: string;
}
