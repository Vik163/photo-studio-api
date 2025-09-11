import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { OneMessageDto } from '../dto/messages.dto';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop()
  userId: string;

  @Prop()
  messages: OneMessageDto[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
