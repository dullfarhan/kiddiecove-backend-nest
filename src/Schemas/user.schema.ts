import { JwtService } from '@nestjs/jwt';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';

@Schema()
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, maxlength: 40, minlength: 3, trim: true })
  name: string;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
  })
  user_name: string;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 1024,
    trim: true,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
    enum: ['MALE', 'FEMALE'],
    minlength: 4,
    maxlength: 6,
    uppercase: true,
    trim: true,
  })
  gender: string;

  @Prop({
    type: String,
    required: true,
    enum: ['PARENT', 'TEACHER', 'SCHOOL_ADMIN', 'ADMIN', 'DRIVER', 'KID'],
    minlength: 3,
    maxlength: 12,
    uppercase: true,
    trim: true,
  })
  type: string;

  @Prop({
    type: String,
    trim: true,
    unique: true,
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
    unique: true,
    minlength: 9,
    maxlength: 15,
    required: true,
    //required: 'Phone number is required',
    match: [
      /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
      'Please fill a valid phone number',
    ],
  })
  phone_number: string;

  @Prop({ type: Date, required: true })
  birthday_date: Date;

  @Prop({
    type: Date,
    default: Date.now,
  })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;

  @Prop({ type: Boolean, default: true, minlength: 3, maxlength: 4 })
  enable: boolean;

  @Prop({
    type: String,
    default: 'https://www.pngarts.com/files/5/User-Avatar-Transparent.png',
  })
  avatar: string;

  @Prop({ type: Boolean, default: false, minlength: 3, maxlength: 4 })
  deleted: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  })
  address_id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true })
  role: mongoose.Types.ObjectId;

  @Prop({ type: Boolean, required: true, minlength: 3, maxlength: 4 })
  connected: boolean;

  generateAuthtoken: () => string;
}

function extractPermissions(role) {
  const simplePermissions = [];
  if (role['permissions'] !== undefined) {
    role.permissions.forEach((permission) => {
      simplePermissions.push(permission.endpoint);
    });
  }

  return simplePermissions;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.generateAuthtoken = function () {
  const simplePermissions = extractPermissions(this.role);
  const token = new JwtService({
    secret: 'mySecureKey',
  }).sign({
    _id: this._id,
    type: this.type,
    user_name: this.user_name,
    avatar: this.avatar,
    connected: this.connected,
    name: this.name,
    email: this.email,
    permissions: simplePermissions,
  });
  return token;
};

export type UserDocument = User & Document;
