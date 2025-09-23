import { StatusOrder } from 'src/order/dto/order.dto';

export class OrdersUserDto {
  deviceId: string;
  data: OneOrder[];
}

export interface OneOrder {
  orderId: string;
  userName: string;
  phone: string;
  service?: string;
  mail: string;
  images?: string[];
  completedImages?: string; // src сформированный fileReader  (хранится только в БД)
  status?: StatusOrder;
  created: string;
  leftDays?: number;
}
