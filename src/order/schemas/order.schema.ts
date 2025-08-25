import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { OneOrderDto } from '../dto/order.dto';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop()
  _id: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  orders: OneOrderDto[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
