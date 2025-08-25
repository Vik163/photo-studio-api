export class OrderDto {
  _id: string;
  name: string;
  phone: string;
  orders: OneOrderDto[];
}

export class BodyDto {
  orderId: string;
  name: string;
  phone: string;
  service: string;
  message?: string;
  images?: string[];
}

export class OneOrderDto {
  orderId: string;
  service: string;
  message?: string;
  images?: string[];
  completedImages?: string[];
  status: 'Принят' | 'В работе' | 'Завершён';
  createdAt: Date;
}
