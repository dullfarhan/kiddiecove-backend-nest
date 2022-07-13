import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Point {
  @Prop({
    type: String,
    default: 'Point',
    enum: ['Point'],
    required: true,
  })
  type: string;

  @Prop({
    type: [Number],
    default: [0, 0],
    required: true,
  })
  coordinates: [number];
}

export const PointSchema = SchemaFactory.createForClass(Point);
