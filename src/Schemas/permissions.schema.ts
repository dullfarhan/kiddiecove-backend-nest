import { Injectable } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Permission {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  name;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  endpoint;

  @Prop({
    type: Date,
    default: Date.now(),
  })
  created_at: Date;

  @Prop({
    type: Date,
    default: Date.now(),
  })
  updated_at: Date;

  @Prop({
    type: Boolean,
    default: true,
    minlength: 3,
    maxlength: 4,
  })
  enable: Boolean;

  @Prop({
    type: Boolean,
    default: false,
    minlength: 3,
    maxlength: 4,
  })
  deleted: Boolean;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

export type PermissionDocument = Permission & Document;
