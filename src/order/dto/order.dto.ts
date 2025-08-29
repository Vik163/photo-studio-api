export class OrderDto {
  userId: string;
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
  name: string;
  phone: string;
  service: string;
  message?: string;
  images?: string[];
  completedImages?: string;
  status:
    | 'Создан'
    | 'Отложен'
    | 'Отменён'
    | 'Принят'
    | 'В работе'
    | 'Выполнен'
    | 'Завершён';
  createdAt: Date;
}

export class ResOrdersDto {
  orderId: string;
  name: string;
  service: string;
  message?: string;
  completedImages?: string;
  status:
    | 'Создан'
    | 'Отложен'
    | 'Отменён'
    | 'Принят'
    | 'В работе'
    | 'Выполнен'
    | 'Завершён';
}
