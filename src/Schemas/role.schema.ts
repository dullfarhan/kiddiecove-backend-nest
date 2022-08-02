import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import { Document } from 'mongoose';

@Schema()
export class Role {
  @Prop({
    type: String,
    required: false,
  })
  name: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Permissions',
    required: true,
  })
  permissions: [mongoose.Schema.Types.ObjectId];

  @Prop({ type: Date, default: Date.now() })
  created_at: Date;

  @Prop({ type: Date, default: Date.now() })
  updated_at: Date;

  @Prop({ type: Boolean, default: true, minlength: 3, maxlength: 4 })
  enable: boolean;

  @Prop({ type: Boolean, default: false, minlength: 3, maxlength: 4 })
  deleted: boolean;
}
// @Schema()
// class permission {
//   @Prop()
//   name: string;

//   @Prop()
//   id: string;
// }

type permissionType = [mongoose.Schema.Types.ObjectId] | null;

export const RoleSchema = SchemaFactory.createForClass(Role);

export type RoleDocument = Role & Document;
