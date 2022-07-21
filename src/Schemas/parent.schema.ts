import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  CustomParentSchool,
  CustomParentSchoolSchema,
} from './customParentSchool.schema';
import { CustomUser } from './customUser.schema';

@Schema()
export class Parent {
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
    enum: ['FATHER', 'MOTHER', 'GUARDIAN'],
    minlength: 6,
    maxlength: 8,
    uppercase: true,
    trim: true,
  })
  type: string;

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
    minlength: 4,
    maxlength: 5,
  })
  enable: boolean;

  @Prop({
    type: Boolean,
    default: false,
    minlength: 4,
    maxlength: 5,
  })
  deleted: boolean;

  @Prop({ type: [CustomParentSchoolSchema] })
  schools: [CustomParentSchool];
}

export const ParentSchema = SchemaFactory.createForClass(Parent);

export type ParentDocument = Parent & Document;
