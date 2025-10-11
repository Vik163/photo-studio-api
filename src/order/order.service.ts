import { Injectable } from '@nestjs/common';
import { BodyDto, OneOrderDto } from './dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { v4 as uuidv4 } from 'uuid';
import { TokensService } from 'src/token/tokens.service';
import { Request, Response } from 'express';
import { BasketService } from './basket.service';
import { getDates } from 'src/utils/lib/getDates';
import { MessagesService } from 'src/messages/messages.service';
import { Messages } from 'src/utils/constants/messages';

@Injectable()
export class OrderService {
  deviceId: string;
  newOrder: OneOrderDto;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private tokenService: TokensService,
    private basketService: BasketService,
    private messagesService: MessagesService,
  ) {
    this.deviceId = '';
    this.newOrder = null;
  }

  /**
   * Добавляет заказ в бд
   * если есть токен, достаёт из токена id устройства и ищет существующие заказы под этим id. Добавляет новый
   * если нет создает новый с id устройства
   * отправляет данные клиенту или сообщение об ошибке
   * @param body
   * @param token - токен с id устройства
   */
  async addOrder(res: Response, body: BodyDto, token?: string): Promise<void> {
    if (token) {
      const payload = await this.tokenService.getPayloadByCookie(token);

      if (payload) {
        this.deviceId = payload;
      } else this.deviceId = uuidv4();
    } else this.deviceId = uuidv4();

    const { date, dayAndMonth } = getDates();

    const order: OneOrderDto = {
      deviceId: this.deviceId,
      orderId: body.orderId,
      userName: body.name,
      phone: body.phone,
      mail: body.mail,
      images: body.images,
      service: body.service,
      status: 'Создан',
      createdAt: date,
      created: dayAndMonth,
    };
    const createdData = new this.orderModel(order);
    this.newOrder = await createdData.save();

    this.basketService.sendBasketWithCookie(
      res,
      this.newOrder,
      Messages.CREATE_ORDER_ERROR,
    );
  }

  /**
   * достаёт из токена id устройства и ищет существующие заказы под этим id.
   * выбирает в найденных нужный по id заказа полученного из параметров запроса и удаяет его.
   * отправляет данные клиенту или сообщение об ошибке
   */
  async deleteOrder(orderId: string): Promise<OneOrderDto | null> {
    const data = await this.orderModel.findOneAndDelete({ orderId }).exec();

    if (data) {
      return data;
    } else return null;
  }

  /**
   * достаёт из токена id устройства и ищет существующие заказы под этим id.
   * выбирает в найденных нужное по id заказа полученного из параметров запроса и обновляет его.
   * отправляет данные клиенту или сообщение об ошибке
   */
  async updateOrder(res: Response, body: BodyDto, token?: string) {
    console.log('body:', body);
    const order = await this.getDataByOrderId(body.orderId);
    if (order) {
      order.images = body.images;
      order.mail = body.mail;
      order.service = body.service;
      order.status = 'Создан';
      order.mailAdmin = '';
      order.completedImages = [];

      await this._updateBD(res, order, Messages.UPDATE_ORDER_ERROR);
    }
  }

  /**
   * Находит заказы по id заказа
   */
  async getDataByOrderId(orderId: string): Promise<OneOrderDto> {
    const data = await this.orderModel.findOne({ orderId }).exec();
    return data;
  }

  /**
   * Обновляет в бд данные
   * создает объект с новыми данными и обновляет бд по id устройства
   * данные отправляет клиенту
   */
  async _updateBD(res: Response, order: OneOrderDto, message: string) {
    await this.orderModel.findOneAndUpdate({ orderId: order.orderId }, order);

    this.basketService.sendBasketWithCookie(res, order, message);
  }
}
