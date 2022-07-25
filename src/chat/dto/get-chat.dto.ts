import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class GetChatDto {
  @IsNotEmpty()
  @ApiProperty({ type: mongoose.Types.ObjectId, required: true })
  id: mongoose.Types.ObjectId;
}
