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
  type: 'order' | 'message';

  @Prop()
  message?: string;

  @Prop()
  service?: string;

  @Prop()
  images?: File[];

  @Prop()
  competedImages?: File[];

  @Prop()
  status: 'Принят' | 'В работе' | 'Завершён';

  @Prop()
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export type OrdersDocument = HydratedDocument<Orders>;

@Schema()
export class Orders {
  @Prop()
  _id: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  orders: OneOrderDto[];
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
