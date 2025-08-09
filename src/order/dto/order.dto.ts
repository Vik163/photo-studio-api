export class OrderDto {
  _id: string;
  name: string;
  phone: string;
  service: string;
  message: string;
  images: File[];
  competedImages?: File[];
  status: 'Принят' | 'В работе' | 'Завершён';
  createdAt: Date;
}
