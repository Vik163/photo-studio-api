export class MailDto {
  deviceId: string;
  messages: OneMailDto[];
}

export class OneMailDto {
  orderId: string;
  name: string;
  phone: string;
  mail: string;
  created: string;
}

export interface MailData {
  orderId: string;
  name: string;
  phone: string;
  mail: string;
}

export class UpdateMailDto {
  orderId: string;
  mail: string;
}
