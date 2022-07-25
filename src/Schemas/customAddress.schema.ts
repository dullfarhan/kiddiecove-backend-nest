import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export class CustomAddress {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
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
    type: String,
    required: true,
    minlength: 1,
    maxlength: 40,
    trim: true,
  })
  city: string;
}
