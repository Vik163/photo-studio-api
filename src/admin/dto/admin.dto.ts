import { StatusOrder } from 'src/order/dto/order.dto';

export class OrdersUserDto {
  deviceId: string;
  ordersUser: OneOrder[];
}

export interface OneOrder {
  orderId: string;
  name: string;
  phone: string;
  service: string;
  message?: string;
  images?: string[];
  completedImages?: string; // src сформированный fileReader  (хранится только в БД)
  status: StatusOrder;
  created: string;
  leftDays: number;
}
