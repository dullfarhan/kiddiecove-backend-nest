import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CustomUser } from './customUser.schema';

@Schema()
export class Teacher {
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
    enum: ['SENIOR', 'JUNIOR'],
    minlength: 3,
    maxlength: 40,
    uppercase: true,
    trim: true,
  })
  designation: string;

  @Prop({
    type: Number,
    required: function () {
      return this.enable;
    },
    min: 10000,
    max: 100000,
    set: (v: number): number => Math.round(v),
    get: (v: number): number => Math.round(v),
  })
  salary: number;

  @Prop({
    type: CustomUser,
    required: true,
  })
  user: CustomUser;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user_id: mongoose.Schema.Types.ObjectId;

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
  deleted: boolean;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'School',
  })
  school_id: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40,
    trim: true,
  })
  school_name: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);

export type TeacherDocument = Teacher & Document;
