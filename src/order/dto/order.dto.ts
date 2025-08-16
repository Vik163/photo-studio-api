export class OrderDto {
  _id: string;
  name: string;
  phone: string;
  type: 'order' | 'message';
  service?: string;
  message?: string;
  images?: File[];
  competedImages?: File[];
  status: 'Принят' | 'В работе' | 'Завершён';
  createdAt: Date;
}

export class OneOrderDto {
  service: string;
  message?: string;
  images?: File[];
  competedImages?: File[];
  status: 'Принят' | 'В работе' | 'Завершён';
  createdAt: Date;
}

export class OrdersDto {
  _id: string;
  name: string;
  phone: string;
  orders: OneOrderDto[];
}
