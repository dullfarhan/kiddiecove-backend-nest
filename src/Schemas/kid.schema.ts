import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CustomAddress } from './customAddress.schema';

@Schema()
export class Kid {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
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
    enum: ['MALE', 'FEMALE'],
    minlength: 4,
    maxlength: 6,
    uppercase: true,
    trim: true,
  })
  gender: string;

  @Prop({
    type: Number,
    required: function () {
      return this.enable;
    },
    min: 4,
    max: 20,
    set: (v: number): number => Math.round(v),
    get: (v: number): number => Math.round(v),
  })
  age: number;

  @Prop({
    type: Boolean,
    default: false,
    minlength: 4,
    maxlength: 5,
  })
  registered: boolean;

  @Prop({
    type: String,
    required: true,
    enum: ['NOT_REGISTERED', 'PENDING', 'REGISTERED'],
    minlength: 7,
    maxlength: 14,
    uppercase: true,
    trim: true,
  })
  registration_status: string;

  @Prop({
    type: CustomAddress,
    required: true,
  })
  address: CustomAddress;

  @Prop({
    type: Date,
    default: Date.now,
  })
  created_at: boolean;

  @Prop({
    type: Date,
    default: Date.now,
  })
  updated_at: boolean;

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
  deleted: boolean;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Parent',
  })
  parent_id: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40,
    trim: true,
  })
  parent_name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
  })
  school_id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    minlength: 3,
    maxlength: 40,
    trim: true,
  })
  school_name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
  })
  class_id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    minlength: 3,
    maxlength: 40,
    trim: true,
  })
  class_name: string;

  @Prop({
    type: Date,
    required: true,
  })
  birthday_date: Date;

  @Prop({
    type: String,
    default: 'https://i.ibb.co/hcV96cm/pp-boy.png',
  })
  avatar: string;
}

export const KidSchema = SchemaFactory.createForClass(Kid);

export type KidDocument = Kid & Document;
