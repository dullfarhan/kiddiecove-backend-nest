import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateDriverDto {
  @ApiProperty()
  @IsMongoId()
  _id: mongoose.Types.ObjectId;
}
