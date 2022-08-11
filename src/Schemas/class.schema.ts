import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

enum Level {
  'ONE',
  'TWO',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'SEVEN',
  'EIGHT',
  'NINE',
  'TENTH',
}

@Schema()
export class Class {
  @Prop({
    type: mongoose.Types.ObjectId,
  })
  _id: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: Level,
    minlength: 3,
    maxlength: 5,
    uppercase: true,
    trim: true,
  })
  standard: Level;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
    max: 70,
    set: (v: number): number => Math.round(v),
    get: (v: number): number => Math.round(v),
  })
  strenght: number;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'School', required: true })
  school_id: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  })
  teacher_id: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40,
    trim: true,
  })
  school_name: string;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40,
    trim: true,
  })
  teacher_name: string;

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
}

export const ClassSchema = SchemaFactory.createForClass(Class);

export type ClassDocument = Class & Document;
