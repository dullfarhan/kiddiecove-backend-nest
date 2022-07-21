import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateDriverDto {
  @ApiProperty()
  _id: mongoose.Types.ObjectId;
}
