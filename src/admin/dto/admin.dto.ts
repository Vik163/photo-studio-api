import { StatusOrder } from 'src/order/dto/order.dto';

export class OrdersUserDto {
  deviceId: string;
  data: OneOrder[];
}

export interface OneOrder {
  deviceId: string;
  orderId: string;
  userName?: string;
  phone?: string;
  service?: string;
  mail?: string;
  images?: string[];
  mailAdmin?: string;
  completedImages?: string[]; // src сформированный fileReader  (хранится только в БД)
  createdAt?: Date;
  status?: StatusOrder;
  created: string;
  leftDays?: number;
  expireAt?: number;
}

export interface UpdateData {
  deviceId: string;
  orderId: string;
  mailAdmin?: string;
  status?: StatusOrder;
  completedImages?: string[];
}
