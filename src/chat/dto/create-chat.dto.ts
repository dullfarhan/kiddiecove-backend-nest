import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateChatDto {
  @IsNotEmpty()
  @ApiProperty({ type: mongoose.Types.ObjectId, required: true })
  fromUser: mongoose.Types.ObjectId;

  @IsNotEmpty()
  @ApiProperty({ type: mongoose.Types.ObjectId, required: true })
  toUser: mongoose.Types.ObjectId;
}
