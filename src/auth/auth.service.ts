import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { TokensService } from 'src/token/tokens.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthDto } from './dto/authDto';
import { BasketService } from 'src/order/basket.service';
import { OrderService } from 'src/order/order.service';
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokensService: TokensService,
    private readonly basketService: BasketService,
    private readonly messagesService: MessagesService,
  ) {}

  // получаем пользователя по id или возвращаем "не найден"
  // получаем время хранения =====================================================
  async authAdmin(pass: { pass: string }, res: Response): Promise<void> {
    if (pass.pass === process.env.ADMIN_PASSWORD) {
      this.tokensService.sendAdminTokens(res);
    } else this.tokensService.deleteAdminTokens(res);
  }

  // получаем пользователя по id или возвращаем "не найден"
  // получаем время хранения =====================================================
  async authClient(data: { phone: string }, res: Response): Promise<void> {
    const order = await this.basketService.getDataByNumPhone(res, data.phone);

    if (!order) {
      const message = await this.messagesService.getMessagesByNumPhone(
        res,
        data.phone,
      );

      if (!message) {
        res.send('Заказов и сообщений не найдено');
      } else {
        res.send('Данные по вашим заказам получены');
      }
    } else {
      res.send('Данные по вашим заказам получены');
    }
  }
}
