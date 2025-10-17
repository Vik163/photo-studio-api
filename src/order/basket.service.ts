import { Injectable } from '@nestjs/common';
import { OneOrderDto, OrderDto, ResOrdersDto } from './dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { TokensService } from 'src/token/tokens.service';
import { Response } from 'express';

@Injectable()
export class BasketService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private tokenService: TokensService,
  ) {}

  /**
   * Находит заказы по id устройства
   */
  async getDataByDeviceId(deviceId: string): Promise<OneOrderDto[]> {
    const data = await this.orderModel.find({ deviceId }).exec();
    return data;
  }

  /**
   * Находит заказы по id заказа
   */
  async getDataByOrderId(orderId: string): Promise<OneOrderDto> {
    const data = await this.orderModel.findOne({ orderId }).exec();
    return data;
  }

  /**
   * Находит заказы по id заказа
   */
  async getDataByNumPhone(res: Response, phone: string): Promise<OneOrderDto> {
    const data = await this.orderModel.findOne({ phone }).exec();
    console.log('data:', data);

    if (data) {
      await this.tokenService.sendToken(res, data.deviceId);

      return data;
    }
    return null;
  }

  /**
   * Фильтрует данные заказа. Удаляет телефон
   * @param order
   * @returns
   */
  _selectData(orders: OneOrderDto[]) {
    const selectData = orders.map((item) => {
      delete item.phone;

      return item;
    });
    return selectData;
  }

  /**
   * Находит заказы по id устройства и фильтрует данные для отправки клиенту
   */
  async getSelectDataByDeviceId(deviceId: string): Promise<OneOrderDto[]> {
    const orders = await this.getDataByDeviceId(deviceId);
    if (orders) {
      const selectData = this._selectData(orders);
      return selectData;
    } else return null;
  }

  /**
   * отправляет данные клиенту с обновленным cookie
   * @param res
   * @param newOrder
   * @param message = сообщение об ошибке
   */
  async sendBasketWithCookie(
    res: Response,
    newOrder: OneOrderDto,
    message: string,
  ) {
    if (newOrder) {
      await this.tokenService.sendToken(res, newOrder.deviceId);

      res.send(newOrder);
    } else res.send({ message });
  }

  /**
   * достаёт из токена id устройства, получает данные заказов под этим id и возвращает их.
   */
  async getBasket(token: string): Promise<ResOrdersDto[]> {
    const deviceId = await this.tokenService.getPayloadByCookie(token);
    if (deviceId) {
      return await this.getSelectDataByDeviceId(deviceId);
    }
  }
}
