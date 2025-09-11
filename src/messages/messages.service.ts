import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/messages.schema';
import { Model } from 'mongoose';
import { MailData, MessagesDto, OneMessageDto } from './dto/messages.dto';
import { v4 as uuidv4 } from 'uuid';
import { getDates } from 'src/utils/lib/getDates';
import { TokensService } from 'src/token/tokens.service';
import { Request, Response } from 'express';
import { BasketService } from 'src/order/basket.service';

@Injectable()
export class MessagesService {
  userId: string;
  newMessage: MessagesDto;

  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private tokenService: TokensService,
    private basketService: BasketService,
  ) {
    this.userId = '';
    this.newMessage = null;
  }

  async addMessage(
    res: Response,
    body: MailData,
    token?: string,
  ): Promise<void> {
    let existMessages: MessagesDto = undefined;

    if (token) {
      this.userId = await this.tokenService.getPayloadByCookie(token);
      existMessages = (await this.getMessagesByUserId(this.userId)) || null;
    }
    if (existMessages) {
      this.userId = existMessages.userId;

      await this.updateMessages(existMessages, body);
    } else {
      await this._createMessages(body);
    }

    if (this.newMessage) this._sendResponseWithCookie(res);
  }

  async getMessagesByUserId(id: string): Promise<MessagesDto> {
    return await this.messageModel.findOne({ userId: id }).exec();
  }

  async _createMessages(body: MailData): Promise<void> {
    const basket = await this.basketService.getBasketByUserId(this.userId);
    this.userId = basket ? this.userId : uuidv4();
    const { date, dayAndMonth } = getDates();
    const messagesDto: MessagesDto = {
      userId: this.userId,
      messages: [
        {
          orderId: body.orderId,
          name: body.name,
          phone: body.phone,
          message: body.message,
          createdAt: date,
          created: dayAndMonth,
        },
      ],
    };
    const createdData = new this.messageModel(messagesDto);
    this.newMessage = await createdData.save();
  }

  async updateMessages(
    existMessages: MessagesDto,
    body: MailData,
  ): Promise<void> {
    const { date, dayAndMonth } = getDates();

    const order: OneMessageDto = {
      orderId: body.orderId,
      name: body.name,
      phone: body.phone,
      message: body.message,
      createdAt: date,
      created: dayAndMonth,
    };

    existMessages.messages.push(order);
    const newData: MessagesDto = {
      userId: this.userId,
      messages: existMessages.messages,
    };

    this.newMessage = await this.messageModel.findOneAndUpdate(
      { userId: this.userId },
      newData,
    );
  }

  async getMessages(res: Response, token?: string): Promise<void> {
    if (token) {
      this.userId = await this.tokenService.getPayloadByCookie(token);
      this._sendResponseWithCookie(res);
    }
  }

  async _sendResponseWithCookie(res: Response) {
    const messages = await this.getMessagesByUserId(this.userId);

    const response = await this.tokenService.sendToken(res, this.userId);
    if (response) {
      res.send(messages.messages);
    } else res.send('Сообщение не отправлено');
  }

  // async getBasket(): Promise<BasketTotalDto> {
  //   const basketProducts: BasketDto[] = await this.basketRepository.find();
  //   let totalPrice = 0;

  //   if (basketProducts.length > 0) {
  //     totalPrice = basketProducts.reduce(
  //       (sum, item) => sum + item.totalPrice,
  //       totalPrice,
  //     );
  //   }

  //   return { basketProducts, totalPrice };
  // }

  // async decreaseBasket(id: string): Promise<BasketTotalDto> {
  //   const product: BasketDto = await this.basketRepository.findOne({
  //     where: { id: id },
  //   });

  //   if (product) {
  //     product.quantity = product.quantity - 1;
  //     product.totalPrice = product.price * product.quantity;
  //   }

  //   const basketDto: BasketDto = await this.basketRepository.save(product);

  //   if (basketDto) {
  //     return this.getBasket();
  //   }
  // }

  // async deleteBasket(id: string): Promise<BasketTotalDto> {
  //   const product: BasketDto = await this.basketRepository.findOne({
  //     where: { id: id },
  //   });
  //   if (product) {
  //     const deleteProduct = await this.basketRepository.remove(product);

  //     if (deleteProduct) {
  //       return this.getBasket();
  //     }
  //   }
  // }
}
