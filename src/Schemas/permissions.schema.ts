import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Permissions {
  @Prop()
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  endpoint: string;

  @Prop({
    type: Date,
    default: Date.now(),
  })
  created_at: Date;

  @Prop({
    type: Date,
    default: Date.now(),
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

export const PermissionSchema = SchemaFactory.createForClass(Permissions);

export type PermissionDocument = Permissions & Document;
