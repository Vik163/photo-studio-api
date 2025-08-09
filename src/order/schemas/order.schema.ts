import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop()
  _id: string;

  @Prop()
  owner: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  message: string;

  @Prop()
  service: string;

  @Prop()
  images: File[];

  @Prop()
  competedImages?: File[];

  @Prop()
  status: 'Принят' | 'В работе' | 'Завершён';

  @Prop()
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
