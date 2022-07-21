import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CustomComment } from './customComment.schema';

@Schema()
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
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
    minlength: 3,
    maxlength: 80,
    trim: true,
  })
  date: string;

  @Prop({
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5,
    trim: true,
  })
  time: string;

  @Prop({
    type: String,
    required: true,
    enum: [
      'lock',
      'favorite',
      'description',
      'date_range',
      'add_circle',
      'language',
      'people',
    ],
    minlength: 4,
    maxlength: 12,
    // uppercase: true,
    trim: true,
  })
  icon: string;

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
    minlength: 2,
    maxlength: 300,
  })
  image: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 500,
  })
  content: string;

  @Prop({
    type: Boolean,
    default: false,
    minlength: 3,
    maxlength: 4,
  })
  liked: boolean;

  @Prop({ type: CustomComment })
  comments: CustomComment;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
    max: 100000,
    set: (v: number): number => Math.round(v),
    get: (v: number): number => Math.round(v),
  })
  like: number;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
    max: 100000,
    set: (v: number): number => Math.round(v),
    get: (v: number): number => Math.round(v),
  })
  dis_like: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user_id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: ['SCHOOL_ADMIN', 'ADMIN'],
    minlength: 3,
    maxlength: 12,
    uppercase: true,
    trim: true,
  })
  user_type: string;

  @Prop({
    type: String,
    required: true,
    enum: ['BROADCAST', 'UNICAST'],
    minlength: 7,
    maxlength: 9,
    uppercase: true,
    trim: true,
  })
  type: string;

  @Prop({
    type: String,
    minlength: 2,
    maxlength: 50,
    required: function () {
      return this.type === 'UNICAST';
    },
  })
  school_name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: function () {
      return this.type === 'UNICAST';
    },
  })
  school_id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: Date,
    default: Date.now,
  })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

export type PostDocumnet = Post & Document;
