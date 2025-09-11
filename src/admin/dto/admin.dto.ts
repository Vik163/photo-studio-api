import { StatusOrder } from 'src/order/dto/order.dto';

export class OrdersUserDto {
  userId: string;
  ordersUser: ResOrderUserDto[];
}

export class ResOrderUserDto {
  orderId: string;
  service: string;
  completedImages?: string;
  status: StatusOrder;
  created: string;
  leftDays: number;
}
