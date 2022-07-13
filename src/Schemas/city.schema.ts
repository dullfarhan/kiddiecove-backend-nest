import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

@Schema()
export class City {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  _id: ObjectId;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40,
    unique: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 40,
    uppercase: true,
    unique: true,
    trim: true,
  })
  code: string;

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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  })
  country_id: ObjectId;
}

export const CitySchema = SchemaFactory.createForClass(City);

export type CityDocument = City & Document;
