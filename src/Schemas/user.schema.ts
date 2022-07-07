import { Injectable } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from './role.schema';
@Injectable()
@Schema()
export class User {
  @Prop()
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, maxlength: 40, minlength: 3, trim: true })
  name: String;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
  })
  user_name: String;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 1024,
    trim: true,
  })
  password;

  @Prop({
    type: String,
    required: true,
    enum: ['MALE', 'FEMALE'],
    minlength: 4,
    maxlength: 6,
    uppercase: true,
    trim: true,
  })
  gender: String;

  @Prop({
    type: String,
    required: true,
    enum: ['PARENT', 'TEACHER', 'SCHOOL_ADMIN', 'ADMIN', 'DRIVER', 'KID'],
    minlength: 3,
    maxlength: 12,
    uppercase: true,
    trim: true,
  })
  type;

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
  email;

  @Prop({
    type: String,
    trim: true,
    unique: true,
    minlength: 9,
    maxlength: 15,
    required: true,
    //required: 'Phone number is required',
    match: [
      /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
      'Please fill a valid phone number',
    ],
  })
  phone_number;

  @Prop({ type: Date, required: true })
  birthday_date;

  @Prop({
    type: Date,
    default: Date.now,
  })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;

  @Prop({ type: Boolean, default: true, minlength: 3, maxlength: 4 })
  enable: Boolean;

  @Prop({
    type: String,
    default: 'https://www.pngarts.com/files/5/User-Avatar-Transparent.png',
  })
  avatar: String;

  @Prop({ type: Boolean, default: false, minlength: 3, maxlength: 4 })
  deleted: Boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  })
  address_id;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true })
  role;

  @Prop({ type: Boolean, required: true, minlength: 3, maxlength: 4 })
  connected:Boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
