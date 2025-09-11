export class MessagesDto {
  userId: string;
  messages: OneMessageDto[];
}

export class OneMessageDto {
  orderId: string;
  name: string;
  phone: string;
  message: string;
  createdAt: Date;
  created: string;
}

export interface MailData {
  orderId: string;
  name: string;
  phone: string;
  message: string;
}

export class ResMessagesDto {
  orderId: string;
  service: string;
  message?: string;
}
