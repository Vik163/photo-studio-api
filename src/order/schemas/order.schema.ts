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

  @Prop()
  expireAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Удаляет из базы через 15 секунд после установки expireAt (могут быть задержки по времени)
OrderSchema.index({ expireAt: 1 }, { expireAfterSeconds: 15 });
OrderSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });
