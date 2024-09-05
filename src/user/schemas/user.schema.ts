import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ default: '' })
  password: string;

  @Prop({ default: '' })
  firstname: string;

  @Prop({ default: '' })
  lastname: string;

  @Prop({ default: '' })
  email: string;

  @Prop({ default: '' })
  usecode: string;

  @Prop({ default: '' })
  selfcode: string;

  @Prop({ default: -1 })
  descending: number;

  @Prop({ default: 0 })
  gain: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
