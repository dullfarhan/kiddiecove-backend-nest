import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class GetChatDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  id: string;
}
