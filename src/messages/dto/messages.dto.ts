export class MailDto {
  deviceId: string;
  messages: OneMailDto[];
}

export class OneMailDto {
  orderId: string;
  name: string;
  phone: string;
  mail: string;
  createdAt: Date;
  created: string;
}

export interface MailData {
  orderId: string;
  name: string;
  phone: string;
  mail: string;
}

export class BodyMailDto {
  orderId: string;
  mail: string;
}
