import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

@Schema()
export class Role {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
    enum: ['PARENT', 'TEACHER', 'SCHOOL_ADMIN', 'ROOT', 'DRIVER', 'KID'],
    minlength: 3,
    maxlength: 12,
    uppercase: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Permission',
    required: true,
  })
  permissions: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: Date, default: Date.now() })
  created_at: Date;

  @Prop({ type: Date, default: Date.now() })
  updated_at: Date;

  @Prop({ type: Boolean, default: true, minlength: 3, maxlength: 4 })
  enable: boolean;

  @Prop({ type: Boolean, default: false, minlength: 3, maxlength: 4 })
  deleted: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

export type RoleDocument = Role & Document;
