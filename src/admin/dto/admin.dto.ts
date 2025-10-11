import { StatusOrder } from 'src/order/dto/order.dto';

export class OrdersUserDto {
  deviceId: string;
  data: OneOrder[];
}

export interface OneOrder {
  orderId: string;
  userName?: string;
  phone?: string;
  service?: string;
  mail?: string;
  images?: string[];
  mailAdmin?: string;
  completedImages?: string[]; // src сформированный fileReader  (хранится только в БД)
  status?: StatusOrder;
  created: string;
  leftDays?: number;
}

export interface UpdateData {
  deviceId: string;
  orderId: string;
  mailAdmin?: string;
  status?: StatusOrder;
  completedImages?: string[];
}

export interface DataCancelOrder {
  deviceId: string;
  orderId: string;
  service: string;
  mailAdmin: string;
  created: string;
  status: 'Отменён';
  expireAt?: number;
}
