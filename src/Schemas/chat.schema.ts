import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Chat {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  toUser: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  fromUser: mongoose.Schema.Types.ObjectId;
}

export const ChatShema = SchemaFactory.createForClass(Chat);

export type ChatDocument = Chat & Document;
