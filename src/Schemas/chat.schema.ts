import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

@Schema()
export class Chat {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  toUser: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  fromUser: ObjectId;
}

export const ChatShema = SchemaFactory.createForClass(Chat);

export type ChatDocument = Chat & Document;
