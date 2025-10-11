import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { OneOrderDto, StatusOrder } from '../dto/order.dto';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop()
  deviceId: string;

  @Prop()
  orderId: string;

  @Prop()
  userName?: string;

  @Prop()
  phone?: string;

  @Prop()
  service?: string;

  @Prop()
  mail?: string;

  @Prop()
  images?: string[];

  @Prop()
  mailAdmin?: string;

  @Prop()
  completedImages?: string[]; // src сформированный fileReader  (хранится только в БД)

  @Prop()
  status: StatusOrder;

  @Prop()
  createdAt?: Date;

  @Prop()
  created: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
