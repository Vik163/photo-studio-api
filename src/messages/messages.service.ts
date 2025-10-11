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
import { Messages } from 'src/utils/constants/messages';

@Injectable()
export class MessagesService {
  deviceId: string;
  newMessage: OneMailDto;

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
    if (token) {
      const payload = await this.tokenService.getPayloadByCookie(token);

      if (payload) {
        this.deviceId = payload;
      } else this.deviceId = uuidv4();
    } else this.deviceId = uuidv4();

    const { dayAndMonth } = getDates();
    const MailDto: OneMailDto = {
      deviceId: this.deviceId,
      orderId: body.orderId,
      userName: body.name,
      phone: body.phone,
      mail: body.mail,
      created: dayAndMonth,
    };
    const createdData = new this.messageModel(MailDto);
    this.newMessage = await createdData.save();

    this._sendResponseWithCookie(
      res,
      Messages.CREATE_MAIL_ERROR,
      this.newMessage,
    );
  }

  /**
   * достаёт из токена id устройства и ищет существующие сообщения под этим id.
   * выбирает в найденных нужное по id заказа полученного из параметров запроса и удаяет его.
   * отправляет данные клиенту или сообщение об ошибке
   */
  async deleteMessage(orderId: string): Promise<OneMailDto | null> {
    const message = await this.messageModel
      .findOneAndDelete({ orderId })
      .exec();

    if (message) {
      return message;
    } else {
      return null;
    }
  }

  /**
   * достаёт из токена id устройства и ищет существующие сообщения под этим id.
   * выбирает в найденных нужное по id заказа полученного из параметров запроса и обновляет его.
   * отправляет данные клиенту или сообщение об ошибке
   */
  async updateMessage(res: Response, body: UpdateMailDto): Promise<void> {
    const message = await this.getMessagesByOrderId(body.orderId);

    message.mail = body.mail;

    await this._updateBD(res, message, Messages.UPDATE_MAIL_ERROR);
  }

  /**
   * достаёт из токена id устройства и полчает существующие сообщения под этим id.
   * отправляет данные клиенту или сообщение об ошибке
   */
  async getMessages(res: Response, token?: string): Promise<void> {
    if (token) {
      this.deviceId = await this.tokenService.getPayloadByCookie(token);

      const messages = await this.getMessagesByDeviceId(this.deviceId);
      if (messages) {
        const selectData = this._selectData(messages);

        this._sendResponseWithCookie(res, Messages.GET_MAILS_ERROR, selectData);
      }
    } else res.send(Messages.GET_MAILS_ERROR);
  }

  /**
   * по id устройства и полчает существующие сообщения под этим id.
   */
  async getMessagesByDeviceId(id: string): Promise<OneMailDto[]> {
    const messages = await this.messageModel.find({ deviceId: id }).exec();

    if (messages) {
      return messages;
    } else return null;
  }

  /**
   * по id обращения и полчает существующие сообщения под этим id.
   */
  async getMessagesByOrderId(id: string): Promise<OneMailDto> {
    const message = await this.messageModel.findOne({ orderId: id }).exec();

    if (message) {
      return message;
    } else return null;
  }

  /**
   * удаляет имя и телефон
   * @param messages - сообщения по id устройства
   */
  _selectData(messages: OneMailDto[]) {
    const selectData = messages.map((item) => {
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
      res.send({ message: Messages.DELETE_MAIL_SUCCESS });
    } else res.send({ message: Messages.DELETE_MAIL_ERROR });
  }

  /**
   * Обновляет в бд данные
   * создает объект с новыми данными и обновляет бд по id устройства
   * данные отправляет клиенту
   */
  async _updateBD(res: Response, message: OneMailDto, messageError: string) {
    await this.messageModel.findOneAndUpdate(
      { orderId: message.orderId },
      message,
    );

    this._sendResponseWithCookie(res, messageError, message);
  }

  /**
   * получает сообщения по id устройства выбирает данные и отправляет клиенту вместе с обновленным cookie
   * @param res
   * @param message - сообщение об ошибке
   */
  async _sendResponseWithCookie(
    res: Response,
    message: string,
    data: OneMailDto[] | OneMailDto,
  ) {
    if (data) {
      await this.tokenService.sendToken(res, this.deviceId);

      res.send(data);
    } else res.send(message);
  }
}
