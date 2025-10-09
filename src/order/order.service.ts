import { Injectable } from '@nestjs/common';
import { BodyDto, OneOrderDto, OrderDto } from './dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { v4 as uuidv4 } from 'uuid';
import { TokensService } from 'src/token/tokens.service';
import { Request, Response } from 'express';
import { BasketService } from './basket.service';
import { getDates } from 'src/utils/lib/getDates';
import { MessagesService } from 'src/messages/messages.service';
import { ResMessages } from 'src/utils/constants/messages';

@Injectable()
export class OrderService {
  deviceId: string;
  newOrder: OrderDto;

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
    let existOrders: OrderDto = undefined;

    if (token) {
      this.deviceId = await this.tokenService.getPayloadByCookie(token);
      existOrders =
        (await this.basketService.getDataByDeviceId(this.deviceId)) || null;
    }

    if (existOrders) {
      const { date, dayAndMonth } = getDates();

      this.deviceId = existOrders.deviceId;

      const order: OneOrderDto = {
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

      existOrders.orders.push(order);

      await this._updateBD(
        res,
        existOrders.orders,
        ResMessages.CREATE_ORDER_ERROR,
      );
    } else {
      await this._createOrder(res, body);
    }
  }

  /**
   * достаёт из токена id устройства и ищет существующие заказы под этим id.
   * выбирает в найденных нужный по id заказа полученного из параметров запроса и удаяет его.
   * отправляет данные клиенту или сообщение об ошибке
   */
  async deleteOrder(res: Response, token: string, orderId: string) {
    this.deviceId = await this.tokenService.getPayloadByCookie(token);
    const data = await this.basketService.getDataByDeviceId(this.deviceId);

    if (data.orders.length < 2) {
      this._deleteDataByDeviceId(res, this.deviceId);
    } else {
      data.orders = data.orders.filter((order) => order.orderId !== orderId);

      await this._updateBD(res, data.orders, ResMessages.DELETE_ORDER_ERROR);
    }
  }

  /**
   * достаёт из токена id устройства и ищет существующие заказы под этим id.
   * выбирает в найденных нужное по id заказа полученного из параметров запроса и обновляет его.
   * отправляет данные клиенту или сообщение об ошибке
   */
  async updateOrder(res: Response, body: BodyDto, token?: string) {
    this.deviceId = await this.tokenService.getPayloadByCookie(token);
    if (this.deviceId) {
      const basket = await this.basketService.getDataByDeviceId(this.deviceId);
      const orders = basket.orders;
      const index = orders.findIndex((el) => el.orderId === body.orderId);

      orders[index].images = body.images;
      orders[index].mail = body.mail;
      orders[index].service = body.service;
      orders[index].status = 'Создан';
      orders[index].mailAdmin = '';
      orders[index].completedImages = [];

      await this._updateBD(res, basket.orders, ResMessages.UPDATE_ORDER_ERROR);
    }
  }

  /**
   *  проверяет есть ли сохранненые сообщения по id устройства. если есть то id не меняется, если нет то создается новое
   * создаёт заказ и отправляет данные клиенту
   * @param res
   * @param body
   */
  async _createOrder(res: Response, body: BodyDto) {
    const { date, dayAndMonth } = getDates();
    const messages = await this.messagesService.getMessagesByDeviceId(
      this.deviceId,
    );
    this.deviceId = messages ? this.deviceId : uuidv4();
    const order: OrderDto = {
      deviceId: this.deviceId,
      orders: [
        {
          orderId: body.orderId,
          userName: body.name,
          phone: body.phone,
          mail: body.mail,
          images: body.images,
          service: body.service,
          status: 'Создан',
          createdAt: date,
          created: dayAndMonth,
        },
      ],
    };
    const createdData = new this.orderModel(order);
    this.newOrder = await createdData.save();

    this.basketService.sendBasketWithCookie(
      res,
      this.newOrder,
      ResMessages.CREATE_ORDER_ERROR,
    );
  }

  /**
   * по id устройства удаляет заказ под этим id.
   * проверяет сообщения по id устройства. Если есть то посылает клиенту сообщение об удалении, если нет то сначала удаляет cookie клиента
   */
  async _deleteDataByDeviceId(res: Response, deviceId: string) {
    const data = await this.orderModel
      .findOneAndDelete({ deviceId: deviceId })
      .exec();

    const messages = await this.messagesService.getMessagesByDeviceId(
      this.deviceId,
    );

    if (!messages) this.tokenService.deleteToken(res);

    if (data) {
      res.send({ message: ResMessages.DELETE_ORDER_SUCCESS });
    } else res.send({ message: ResMessages.DELETE_ORDER_ERROR });
  }

  /**
   * Обновляет в бд данные
   * создает объект с новыми данными и обновляет бд по id устройства
   * данные отправляет клиенту
   */
  async _updateBD(res: Response, orders: OneOrderDto[], message: string) {
    const newData: OrderDto = {
      deviceId: this.deviceId,
      orders,
    };

    this.newOrder = await this.orderModel.findOneAndUpdate(
      { deviceId: this.deviceId },
      newData,
    );

    this.basketService.sendBasketWithCookie(res, this.newOrder, message);
  }
}
