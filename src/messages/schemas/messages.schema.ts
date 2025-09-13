import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { OneMailDto } from '../dto/messages.dto';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop()
  deviceId: string;

  @Prop()
  messages: OneMailDto[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
