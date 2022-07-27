// import { PartialType } from '@nestjs/swagger';
// import { CreateParentDto } from './create-parent.dto';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

class Submitting_info {
  @ApiProperty({ type: String, required: true })
  @IsMongoId()
  @IsNotEmpty()
  kid_id: mongoose.Types.ObjectId;

  @ApiProperty({ type: String, required: true })
  @IsMongoId()
  @IsNotEmpty()
  class_id: mongoose.Types.ObjectId;
}

export class RequestParentDto {
  @ApiProperty({ type: String, required: true })
  @IsMongoId()
  @IsNotEmpty()
  school_id: mongoose.Types.ObjectId;

  @ApiProperty({ type: String, required: true })
  @Type(() => Submitting_info)
  submitting_info: Submitting_info;
}
