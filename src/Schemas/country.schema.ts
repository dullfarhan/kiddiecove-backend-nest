import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

@Schema()
export class Country {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
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
    type: String,
    required: true,
    minlength: 1,
    maxlength: 5,
    trim: true,
  })
  country_code: string;

  @Prop({
    type: Number,
    required: true,
    minlength: 5,
    maxlength: 15,
  })
  number_length: number;

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

  @Prop({ type: Boolean, default: true, minlength: 3, maxlength: 4 })
  enable: boolean;

  @Prop({ type: Boolean, default: false, minlength: 3, maxlength: 4 })
  deleted: boolean;
}

export const CountrySchema = SchemaFactory.createForClass(Country);

export type CountryDocument = Country & Document;
