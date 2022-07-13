import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

@Schema()
export class CustomSchool {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: ObjectId;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 300,
  })
  description: string;

  @Prop({
    type: String,
    required: true,
    enum: ['STATE', 'PRIVATE'],
    minlength: 5,
    maxlength: 7,
    uppercase: true,
    trim: true,
  })
  type: string;

  @Prop({
    type: String,
    index: {
      unique: true,
      partialFilterExpression: { campus_code: { $type: 'string' } },
    },
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
  })
  campus_code: string;

  @Prop({
    type: String,
    index: {
      unique: true,
      partialFilterExpression: { branch_name: { $type: 'string' } },
    },
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
  })
  branch_name: string;

  @Prop({
    type: String,
    trim: true,
    index: {
      unique: true,
      partialFilterExpression: { email: { $type: 'string' } },
    },
    minlength: 10,
    maxlength: 60,
    required: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{3,4})?$/,
      'Please fill a valid email address',
    ],
  })
  email: string;

  @Prop({
    type: String,
    trim: true,
    index: {
      unique: true,
      partialFilterExpression: { phone_number: { $type: 'string' } },
    },
    minlength: 9,
    maxlength: 15,
    required: true,
    match: [
      /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
      'Please fill a valid phone number',
    ],
  })
  phone_number: string;
}

export const CustomSchoolSchema = SchemaFactory.createForClass(CustomSchool);

export type CustomSchoolDocument = CustomSchool & Document;
