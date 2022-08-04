// import { PartialType } from '@nestjs/swagger';
// import { CreateParentDto } from './create-parent.dto';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

class kid_id {
  @ApiProperty({ type: String, required: true })
  @IsMongoId()
  @IsNotEmpty()
  kid_id: mongoose.Types.ObjectId;
}

class class_id {
  @ApiProperty({ type: String, required: true })
  @IsMongoId()
  @IsNotEmpty()
  class_id: mongoose.Types.ObjectId;
}

class Submitting_info {
  // static type submitting_info: (kid_id | class_id)[];
}

export class RequestParentDto {
  @ApiProperty({ type: String, required: true })
  @IsMongoId()
  @IsNotEmpty()
  school_id: mongoose.Types.ObjectId;

  @ApiProperty({ type: [kid_id, class_id], required: true })
  @Type(() => Submitting_info)
  submitting_info: (kid_id | class_id)[];
}
