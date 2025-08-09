import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop()
  _id: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  message: string;

  @Prop()
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
