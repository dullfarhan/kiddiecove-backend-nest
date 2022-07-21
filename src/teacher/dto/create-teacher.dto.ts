import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateTeacherDto {
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ type: String, required: true })
  // @isString()
  name: string;
  @ApiProperty({ type: String, required: true })
  code: string;
  @ApiProperty({ type: String, required: true })
  country_id: string;
}
