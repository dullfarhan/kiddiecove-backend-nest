import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class CustomAddress extends Document {
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
export const CustomAddressSchema = SchemaFactory.createForClass(CustomAddress);
