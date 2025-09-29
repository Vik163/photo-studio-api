import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/messages.schema';
import { Model } from 'mongoose';
import {
  UpdateMailDto,
  MailData,
  MailDto,
  OneMailDto,
} from './dto/messages.dto';
import { v4 as uuidv4 } from 'uuid';
import { getDates } from 'src/utils/lib/getDates';
import { TokensService } from 'src/token/tokens.service';
import { Response } from 'express';
import { BasketService } from 'src/order/basket.service';
import { ResMessages } from 'src/utils/constants/messages';

@Injectable()
export class MessagesService {
  deviceId: string;
  newMessage: MailDto;

  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private tokenService: TokensService,
    private basketService: BasketService,
  ) {
    this.deviceId = '';
    this.newMessage = null;
  }

  /**
   * Добавляет сообщение в бд
   * если есть токен, достаёт из токена id устройства и ищет существующие сообщения под этим id. Добавляет новое
   * если нет создает новое с id устройства
   * отправляет данные клиенту или сообщение об ошибке
   * @param body
   * @param token - токен с id устройства
   */
  async addMessage(
    res: Response,
    body: MailData,
    token?: string,
  ): Promise<void> {
    let existMessages: MailDto = undefined;

    if (token) {
      this.deviceId = await this.tokenService.getPayloadByCookie(token);
      existMessages = (await this.getMessagesByDeviceId(this.deviceId)) || null;
    }
    if (existMessages) {
      this.deviceId = existMessages.deviceId;
      const { dayAndMonth } = getDates();

      const order: OneMailDto = {
        orderId: body.orderId,
        userName: body.name,
        phone: body.phone,
        mail: body.mail,
        created: dayAndMonth,
      };

      existMessages.messages.push(order);

      await this._updateBD(
        res,
        existMessages.messages,
        ResMessages.CREATE_MAIL_ERROR,
      );
    } else {
      await this._createMessages(res, body);
    }
  }

  /**
   * достаёт из токена id устройства и ищет существующие сообщения под этим id.
   * выбирает в найденных нужное по id заказа полученного из параметров запроса и удаяет его.
   * отправляет данные клиенту или сообщение об ошибке
   */
  async deleteMessage(res: Response, token: string, orderId: string) {
    this.deviceId = await this.tokenService.getPayloadByCookie(token);
    const data = await this.getMessagesByDeviceId(this.deviceId);

    if (data.messages.length < 2) {
      this._deleteDataByDeviceId(res);
    } else {
      data.messages = data.messages.filter(
        (message) => message.orderId !== orderId,
      );
      await this._updateBD(res, data.messages, ResMessages.DELETE_MAIL_ERROR);
    }
  }

  /**
   * достаёт из токена id устройства и ищет существующие сообщения под этим id.
   * выбирает в найденных нужное по id заказа полученного из параметров запроса и обновляет его.
   * отправляет данные клиенту или сообщение об ошибке
   */
  async updateMessages(
    res: Response,
    token: string,
    body: UpdateMailDto,
  ): Promise<void> {
    const userId = await this.tokenService.getPayloadByCookie(token);
    if (userId) {
      const data = await this.getMessagesByDeviceId(userId);

      const messages = data.messages;
      const index = messages.findIndex((el) => el.orderId === body.orderId);

      messages[index].mail = body.mail;

      await this._updateBD(res, data.messages, ResMessages.UPDATE_MAIL_ERROR);
    }
  }

  /**
   * достаёт из токена id устройства и полчает существующие сообщения под этим id.
   * отправляет данные клиенту или сообщение об ошибке
   */
  async getMessages(res: Response, token?: string): Promise<void> {
    if (token) {
      this.deviceId = await this.tokenService.getPayloadByCookie(token);
      this._sendResponseWithCookie(res, 'Сообщения не найдены');
    }
  }

  /**
   * по id устройства и полчает существующие сообщения под этим id.
   */
  async getMessagesByDeviceId(id: string): Promise<MailDto> {
    const messages = await this.messageModel.findOne({ deviceId: id }).exec();

    if (messages) {
      return messages;
    } else return null;
  }

  /**
   * удаляет имя и телефон
   * @param messages - сообщения по id устройства
   */
  _selectData(messages: MailDto) {
    const selectData = messages.messages.map((item) => {
      delete item.phone;
      delete item.userName;

      return item;
    });
    return selectData;
  }

  /**
   * по id устройства удаляет сообщения под этим id.
   * проверяет корзину заказов по id устройства. Если есть то посылает клиенту сообщение, если нет то сначала удаляет cookie клиента
   */
  async _deleteDataByDeviceId(res: Response) {
    const data = await this.messageModel
      .findOneAndDelete({ deviceId: this.deviceId })
      .exec();

    const basket = await this.basketService.getDataByDeviceId(this.deviceId);

    if (!basket) this.tokenService.deleteToken(res);
    if (data) {
      res.send({ message: ResMessages.DELETE_MAIL_SUCCESS });
    } else res.send({ message: ResMessages.DELETE_MAIL_ERROR });
  }

  /**
   * проверяет корзину заказов по id устройства. Если есть, то оставляет id устройства тем же иначе создает новое
   * создает и сохраняет данные в бд
   */
  async _createMessages(res: Response, body: MailData): Promise<void> {
    const basket = await this.basketService.getBasketByDeviceId(this.deviceId);
    this.deviceId = basket ? this.deviceId : uuidv4();
    const { dayAndMonth } = getDates();
    const MailDto: MailDto = {
      deviceId: this.deviceId,
      messages: [
        {
          orderId: body.orderId,
          userName: body.name,
          phone: body.phone,
          mail: body.mail,
          created: dayAndMonth,
        },
      ],
    };
    const createdData = new this.messageModel(MailDto);
    this.newMessage = await createdData.save();

    if (this.newMessage)
      this._sendResponseWithCookie(res, ResMessages.CREATE_MAIL_ERROR);
  }

  /**
   * Обновляет в бд данные
   * создает объект с новыми данными и обновляет бд по id устройства
   * данные отправляет клиенту
   */
  async _updateBD(res: Response, messages: OneMailDto[], message: string) {
    const newData: MailDto = {
      deviceId: this.deviceId,
      messages,
    };
    this.newMessage = await this.messageModel.findOneAndUpdate(
      { deviceId: this.deviceId },
      newData,
    );
    this._sendResponseWithCookie(res, message);
  }

  /**
   * получает сообщения по id устройства выбирает данные и отправляет клиенту вместе с обновленным cookie
   * @param res
   * @param message - сообщение об ошибке
   */
  async _sendResponseWithCookie(res: Response, message: string) {
    const messages = await this.getMessagesByDeviceId(this.deviceId);
    if (messages) {
      const selectData = this._selectData(messages);

      await this.tokenService.sendToken(res, this.deviceId);

      res.send(selectData);
    } else res.send(message);
  }
}
