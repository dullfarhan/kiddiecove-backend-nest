import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type TeacherDocument = Document;

export const Teacher = new mongoose.Schema({
  name: String,
  age: Number,
  breed: String,
});
