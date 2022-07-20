import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import { Document } from 'mongoose';

// @Schema()
// class permissionItem extends Document {
//   @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
//   type: mongoose.Schema.Types.ObjectId;

//   @Prop({
//     required: false,
//   })
//   content: string;
// }

// export const permissionItemSchema =
//   SchemaFactory.createForClass(permissionItem);

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
    type: [
      { type: mongoose.Schema.Types.ObjectId },
      { type: null },
      { type: String },
    ],
    ref: 'Permission',
    required: true,
  })
  permissions: [mongoose.Schema.Types.ObjectId, string] | null;

  @Prop({ type: Date, default: Date.now() })
  created_at: Date;

  @Prop({ type: Date, default: Date.now() })
  updated_at: Date;

  @Prop({ type: Boolean, default: true, minlength: 3, maxlength: 4 })
  enable: boolean;

  @Prop({ type: Boolean, default: false, minlength: 3, maxlength: 4 })
  deleted: boolean;
}

type permissionType = [mongoose.Schema.Types.ObjectId] | null;

export const RoleSchema = SchemaFactory.createForClass(Role);

export type RoleDocument = Role & Document;
