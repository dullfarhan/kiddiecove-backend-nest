import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import { CustomSchool, CustomSchoolSchema } from './customSchool.schema';
import { CustomUser, CustomUserSchema } from './customUser.schema';

@Schema()
export class SchoolAdmin {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: ObjectId;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40,
    trim: true,
  })
  name: string;

  @Prop({
    type: Boolean,
    default: false,
    minlength: 3,
    maxlength: 4,
  })
  registered: boolean;

  @Prop({
    type: Number,
    required: function () {
      return this.enable;
    },
    min: 10000,
    max: 200000,
    set: (v) => Math.round(v),
    get: (v) => Math.round(v),
  })
  salary: number;

  @Prop({ type: CustomUserSchema, required: true })
  user: CustomUser;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user_id: ObjectId;

  @Prop({ type: Date, default: Date.now })
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

  @Prop({ type: CustomSchoolSchema })
  school: CustomSchool;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
  })
  school_id: ObjectId;
}

export const SchoolAdminSchema = SchemaFactory.createForClass(SchoolAdmin);

export type SchoolAdminDocument = SchoolAdmin & Document;
