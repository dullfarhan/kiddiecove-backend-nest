import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateChatDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  @IsMongoId()
  fromUser: mongoose.Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ type: mongoose.Types.ObjectId, required: true })
  toUser: mongoose.Types.ObjectId;
}
