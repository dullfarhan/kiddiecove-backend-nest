import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

@Schema()
export class CustomComment {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: ObjectId;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
  })
  from: string;

  @Prop({
    type: String,
    minlength: 2,
    maxlength: 300,
    default: 'https://i.ibb.co/hcV96cm/pp-boy.png',
  })
  avatar: string;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 80,
    trim: true,
  })
  date: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 500,
    trim: true,
  })
  message: string;

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
}

export const CustomCommentSchema = SchemaFactory.createForClass(CustomComment);

export type CustomCommentDocument = CustomComment & Document;
