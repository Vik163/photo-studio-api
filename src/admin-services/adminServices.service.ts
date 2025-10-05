import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { v4 as uuidv4 } from 'uuid';
import { getDates } from 'src/utils/lib/getDates';
import { Response } from 'express';

import { ResMessages } from 'src/utils/constants/messages';
import { Services } from './schemas/services.schema';
import {
  AdminOneServiceDto,
  AdminServicesDto,
  TypeServices,
} from './dto/services.dto';

@Injectable()
export class AdminServicesService {
  constructor(
    @InjectModel(Services.name) private servicesModel: Model<Services>,
  ) {}

  /**
   * Добавляет сообщение в бд
   * если есть токен, достаёт из токена id устройства и ищет существующие сообщения под этим id. Добавляет новое
   * если нет создает новое с id устройства
   * отправляет данные клиенту или сообщение об ошибке
   * @param body
   * @param token - токен с id устройства
   */
  async addService(body: AdminServicesDto): Promise<void> {
    const newData: AdminOneServiceDto = {
      type: body.type,
      service: body.service,
      price: body.price,
      image: body.image,
    };

    const createdData = new this.servicesModel(newData);
    const res = await createdData.save();

    return res;
  }

  /**
   * достаёт из токена id устройства и ищет существующие сообщения под этим id.
   * выбирает в найденных нужное по id заказа полученного из параметров запроса и удаяет его.
   * отправляет данные клиенту или сообщение об ошибке
   */
  //   async deleteMessage(res: Response, token: string, orderId: string) {
  //     this.deviceId = await this.tokenService.getPayloadByCookie(token);
  //     const data = await this.getMessagesByDeviceId(this.deviceId);

  //     if (data.messages.length < 2) {
  //       this._deleteDataByDeviceId(res);
  //     } else {
  //       data.messages = data.messages.filter(
  //         (message) => message.orderId !== orderId,
  //       );
  //       await this._updateBD(res, data.messages, ResMessages.DELETE_MAIL_ERROR);
  //     }
  //   }

  /**
   * достаёт из токена id устройства и ищет существующие сообщения под этим id.
   * выбирает в найденных нужное по id заказа полученного из параметров запроса и обновляет его.
   * отправляет данные клиенту или сообщение об ошибке
   */
  //   async updateMessages(
  //     res: Response,
  //     token: string,
  //     body: UpdateMailDto,
  //   ): Promise<void> {
  //     const userId = await this.tokenService.getPayloadByCookie(token);
  //     if (userId) {
  //       const data = await this.getMessagesByDeviceId(userId);

  //       const messages = data.messages;
  //       const index = messages.findIndex((el) => el.orderId === body.orderId);

  //       messages[index].mail = body.mail;

  //       await this._updateBD(res, data.messages, ResMessages.UPDATE_MAIL_ERROR);
  //     }
  //   }

  /**
   * достаёт из токена id устройства и полчает существующие сообщения под этим id.
   * отправляет данные клиенту или сообщение об ошибке
   */
  //   async getMessages(res: Response, token?: string): Promise<void> {
  //     if (token) {
  //       this.deviceId = await this.tokenService.getPayloadByCookie(token);
  //       this._sendResponseWithCookie(res, 'Сообщения не найдены');
  //     }
  //   }

  /**
   * по id устройства и полчает существующие сообщения под этим id.
   */
  async getServicesByName(name: TypeServices): Promise<AdminServicesDto> {
    const services = await this.servicesModel.findOne({ [name]: name }).exec();

    if (services) {
      return services;
    } else return null;
  }

  /**
   * по id устройства удаляет сообщения под этим id.
   * проверяет корзину заказов по id устройства. Если есть то посылает клиенту сообщение, если нет то сначала удаляет cookie клиента
   */
  //   async _deleteDataByDeviceId(res: Response) {
  //     const data = await this.messageModel
  //       .findOneAndDelete({ deviceId: this.deviceId })
  //       .exec();

  //     const basket = await this.basketService.getDataByDeviceId(this.deviceId);

  //     if (!basket) this.tokenService.deleteToken(res);
  //     if (data) {
  //       res.send({ message: ResMessages.DELETE_MAIL_SUCCESS });
  //     } else res.send({ message: ResMessages.DELETE_MAIL_ERROR });
  //   }

  /**
   * Обновляет в бд данные
   * создает объект с новыми данными и обновляет бд по id устройства
   * данные отправляет клиенту
   */
  //   async _updateBD(res: Response, messages: OneMailDto[], message: string) {
  //     const newData: MailDto = {
  //       deviceId: this.deviceId,
  //       messages,
  //     };
  //     this.newMessage = await this.messageModel.findOneAndUpdate(
  //       { deviceId: this.deviceId },
  //       newData,
  //     );
  //     this._sendResponseWithCookie(res, message);
  //   }
}
