import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateChatDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  @IsMongoId()
  fromUser: string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ type: String, required: true })
  toUser: string;
}
