export class MessagesDto {
  _id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: Date;
}

export interface MailData {
  name: string;
  phone: string;
  message: string;
}
