import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import { CustomUser } from './customUser.schema';

@Schema()
export class Admin {
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
    type: String,
    required: true,
    enum: ['ROOT', 'CLIENT'],
    minlength: 3,
    maxlength: 40,
    uppercase: true,
    trim: true,
  })
  admin_type: string;

  @Prop({
    type: CustomUser,
    required: true,
  })
  user: CustomUser;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user_id: ObjectId;

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
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

export type AdminDocument = Admin & Document;
