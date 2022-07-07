import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

@Schema()
export class Driver {
  _id: ObjectId;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40,
    trim: true,
  })
  name;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40,
    trim: true,
  })
  license_number;

  @Prop({
    type: Number,
    required: function () {
      return this.enable;
    },
    min: 10000,
    max: 100000,
    set: (v) => Math.round(v),
    get: (v) => Math.round(v),
  })
  salary: Number;

  @Prop({
    type: String, // to be determined
    required: true,
  })
  user;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user_id: ObjectId;

  @Prop({
    type: Date,
    default: Date.now,
  })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;

  @Prop({ type: Boolean, default: true, minlength: 3, maxlength: 4 })
  enable: Boolean;

  @Prop({ type: Boolean, default: false, minlength: 3, maxlength: 4 })
  deleted: Boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'School' })
  school_id: ObjectId;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40,
    trim: true,
  })
  school_name;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);

export type DriverDocument = Driver & Document;
