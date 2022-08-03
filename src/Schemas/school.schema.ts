import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CustomAddress, CustomAddressSchema } from './customAddress.schema';

@Schema()
export class School {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 300,
  })
  description: string;

  @Prop({
    type: String,
    required: true,
    enum: ['STATE', 'PRIVATE'],
    minlength: 5,
    maxlength: 7,
    uppercase: true,
    trim: true,
  })
  type: string;

  @Prop({
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
  })
  campus_code: string;

  @Prop({
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
  })
  branch_name: string;

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
    type: Date,
    default: Date.now,
  })
  created_at: Date;

  @Prop({
    type: Date,
    default: Date.now,
  })
  updated_at: Date;

  @Prop({
    type: Boolean,
    default: true,
    minlength: 3,
    maxlength: 4,
  })
  enable: boolean;

  @Prop({
    type: Boolean,
    default: false,
    minlength: 3,
    maxlength: 4,
  })
  delete: boolean;

  @Prop({
    type: CustomAddressSchema,
    required: true,
  })
  address: CustomAddress;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  })
  address_id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  })
  school_admin_name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolAdmin',
    required: true,
  })
  school_admin_id: mongoose.Schema.Types.ObjectId;
}

export const SchoolSchema = SchemaFactory.createForClass(School);

export type SchoolDocument = School & Document;
