import { IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateDriverDto {
  _id: mongoose.Types.ObjectId;
}
