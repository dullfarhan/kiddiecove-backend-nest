import { IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateTeacherDto {
  _id: mongoose.Types.ObjectId;

  @IsString()
  name: string;
  code: string;
  country_id: string;
}
