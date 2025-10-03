export type StatusOrder =
  | 'Создан' // редактирование, удаление, no-image, нет скачивания
  | 'Отложен' // редактирование, удаление, no-image, нет скачивания
  | 'Отменён' // редактирование, удаление, no-image, нет скачивания
  | 'Принят' // редактирование, удаление, no-image, нет скачивания
  | 'В работе' // no-image, нет скачивания
  | 'Выполнен' // готовое фото через фильтр, нет скачивания
  | 'Оплачен' // готовое фото, скачивание
  | 'Завершён'; // удаление, готовое фото, скачивание

export class OrderDto {
  deviceId: string;
  orders: OneOrderDto[];
}

export class BodyDto {
  orderId: string;
  name: string;
  phone: string;
  service: string;
  mail?: string;
  images?: string[];
}

export class OneOrderDto {
  orderId: string;
  userName: string;
  phone: string;
  service: string;
  mail?: string;
  images?: string[];
  mailAdmin?: string;
  completedImages?: string[]; // src сформированный fileReader  (хранится только в БД)
  status: StatusOrder;
  createdAt: Date;
  created: string;
}

export class ResOrdersDto {
  orderId: string;
  service: string;
  mail?: string;
  mailAdmin?: string;
  completedImages?: string[];
  status: StatusOrder;
}
