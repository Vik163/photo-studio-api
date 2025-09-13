import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { OneOrderDto } from '../dto/order.dto';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop()
  deviceId: string;

  @Prop()
  orders: OneOrderDto[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
