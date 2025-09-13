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
  async getDataByDeviceId(deviceId: string): Promise<OrderDto> {
    const data = await this.orderModel.findOne({ deviceId: deviceId }).exec();
    return data;
  }

  /**
   * Фильтрует данные заказа. Удаляет телефон
   * @param order
   * @returns
   */
  _selectData(order: Order) {
    const selectData = order.orders.map((item) => {
      delete item.phone;

      return item;
    });
    return selectData;
  }

  /**
   * Находит заказы по id устройства и фильтрует данные для отправки клиенту
   */
  async getBasketByDeviceId(deviceId: string): Promise<OneOrderDto[]> {
    const order = await this.getDataByDeviceId(deviceId);
    if (order) {
      const selectData = this._selectData(order);
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
    newOrder: OrderDto,
    message: string,
  ) {
    if (newOrder) {
      const order = await this.getBasketByDeviceId(newOrder.deviceId);

      const response = await this.tokenService.sendToken(
        res,
        newOrder.deviceId,
      );
      if (response) {
        res.send(order);
      } else res.send({ message });
    }
  }

  /**
   * достаёт из токена id устройства, получает данные заказов под этим id и возвращает их.
   */
  async getBasket(token: string): Promise<ResOrdersDto[]> {
    const deviceId = await this.tokenService.getPayloadByCookie(token);
    if (deviceId) {
      return await this.getBasketByDeviceId(deviceId);
    }
  }
}
