import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export class Point {
  @Prop({
    type: String,
    default: 'Point',
    enum: ['Point'],
  })
  type: string;

  @Prop({
    type: [Number],
    default: [0, 0],
  })
  coordinates: number[];
}
