import { Prop } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export class CustomParentSchool extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'School' })
  school_id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    minlength: 3,
    maxlength: 40,
    trim: true,
  })
  school_name: string;

  @Prop({
    type: Boolean,
    default: false,
    minlength: 4,
    maxlength: 5,
  })
  registered: boolean;

  @Prop({
    type: String,
    required: true,
    enum: ['NOT_REGISTERED', 'PENDING', 'REGISTERED'],
    minlength: 7,
    maxlength: 14,
    uppercase: true,
    trim: true,
  })
  registration_status: string;
}
