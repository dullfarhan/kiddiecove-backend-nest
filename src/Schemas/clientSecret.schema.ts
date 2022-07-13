import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

@Schema({})
export class ClientSecret {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: ObjectId;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40,
    unique: true,
  })
  client_id: string;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 1024,
    trim: true,
  })
  secret: string;
}

export const ClientSecretSchema = SchemaFactory.createForClass(ClientSecret);

export type ClientSecretDocument = ClientSecret & Document;
