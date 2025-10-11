import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { OneMailDto } from '../dto/messages.dto';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop()
  deviceId: string;

  @Prop()
  orderId: string;

  @Prop()
  userName: string;

  @Prop()
  phone: string;

  @Prop()
  mail: string;

  @Prop()
  mailAdmin?: string;

  @Prop()
  created: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
