// import { PartialType } from '@nestjs/swagger';
// import { CreateParentDto } from './create-parent.dto';

import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class submit_info {
  @ApiProperty({ type: String, required: true })
  @IsMongoId()
  kid_id: mongoose.Types.ObjectId;

  @ApiProperty({ type: String, required: true })
  @IsMongoId()
  class_id: mongoose.Types.ObjectId;
}

export class RequestParentDto {
  @ApiProperty({ type: String, required: true })
  @IsMongoId()
  @IsNotEmpty()
  school_id: mongoose.Types.ObjectId;

  @ApiProperty({ type: [submit_info], required: true })
  @IsArray()
  @ValidateNested()
  @Type(() => submit_info)
  submitting_info: [submit_info];
}
