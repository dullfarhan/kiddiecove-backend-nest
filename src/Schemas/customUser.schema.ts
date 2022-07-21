import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { CustomAddress, CustomAddressSchema } from './customAddress.schema';

export class CustomUser extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
  })
  user_name: string;

  @Prop({
    type: String,
    required: true,
    enum: ['MALE', 'FEMALE'],
    minlength: 4,
    maxlength: 6,
    uppercase: true,
    trim: true,
  })
  gender: string;

  @Prop({
    type: String,
    trim: true,
    unique: true,
    minlength: 10,
    maxlength: 60,
    required: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{3,4})?$/,
      'Please fill a valid email address',
    ],
  })
  email: string;

  @Prop({
    type: String,
    trim: true,
    unique: true,
    minlength: 9,
    maxlength: 15,
    required: true,
    match: [
      /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
      'Please fill a valid phone number',
    ],
  })
  phone_number: string;

  @Prop({
    type: CustomAddressSchema,
    required: true,
  })
  address: CustomAddress;
}
