import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

@Schema()
class EndPoint {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  _id: ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  endpoint: string;

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

export const EndPointSchema = SchemaFactory.createForClass(EndPoint);

export type EndPointDocument = EndPoint & Document;
