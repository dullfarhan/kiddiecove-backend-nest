import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Point } from './point.schema';

@Schema()
export class Address {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  })
  address_details: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 40,
    trim: true,
  })
  area_name: string;

  @Prop({
    type: Point,
  })
  location: Point;

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
    default: true,
    minlength: 3,
    maxlength: 4,
  })
  deleted: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  })
  city_id: mongoose.Schema.Types.ObjectId;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

export type AddressDocument = Address & Document;
