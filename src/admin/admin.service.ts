import { Injectable } from '@nestjs/common';
import {
  BodyDto,
  OneOrderDto,
  OrderDto,
  ResOrdersDto,
} from '../order/dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../order/schemas/order.schema';
import { v4 as uuidv4 } from 'uuid';
import { TokensService } from 'src/token/tokens.service';
import { Request, Response } from 'express';
import { BasketService } from '../order/basket.service';
import { OrdersUserDto } from './dto/admin.dto';
import { getLeftDays } from 'src/utils/lib/getDates';

@Injectable()
export class AdminService {
  userId: string;
  newOrder: OrderDto;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private tokenService: TokensService,
    private basketService: BasketService,
  ) {
    this.userId = '';
    this.newOrder = null;
  }

  _selectDataFromOrders(data: OrderDto[]): OrdersUserDto[] {
    return data.map((userOrders) => {
      const arrOrders = userOrders.orders.map((order) => {
        const leftDays = getLeftDays(order.createdAt, 15);

        return {
          orderId: order.orderId,
          service: order.service,
          completedImages: order.completedImages,
          status: order.status,
          created: order.created,
          leftDays,
        };
      });
      return { userId: userOrders.userId, ordersUser: arrOrders };
    });
  }

  async getOrders() {
    const data = await this.orderModel.find().exec();

    const selectData = this._selectDataFromOrders(data);

    return selectData;
  }

  async _deleteDataByUserId(res: Response, userId: string) {
    const data = await this.orderModel
      .findOneAndDelete({ userId: userId })
      .exec();
    if (data) this.tokenService.deleteToken(res);
    res.send({ message: 'Заказ успешно удалён' });
  }

  async deleteOrder(res: Response, token: string, orderId: string) {
    const userId = await this.tokenService.getPayloadByCookie(token);
    const data = await this.basketService.getDataByUserId(userId);

    if (data.orders.length < 2) {
      this._deleteDataByUserId(res, userId);
    } else {
      data.orders = data.orders.filter((order) => order.orderId !== orderId);

      const createdData = new this.orderModel(data);

      await createdData.updateOne();
      this.newOrder = await createdData.save();

      this.basketService.sendBasketWithCookie(
        res,
        this.newOrder,
        'Заказ успешно удалён',
      );
    }
  }

  async updateOrder(res: Response, body: BodyDto, token?: string) {
    const userId = await this.tokenService.getPayloadByCookie(token);
    if (userId) {
      const basket = await this.basketService.getDataByUserId(userId);
      const orders = basket.orders;
      const index = orders.findIndex((el) => el.orderId === body.orderId);

      orders[index].images = body.images;
      orders[index].message = body.message;
      orders[index].service = body.service;

      const createdData = new this.orderModel(basket);

      await createdData.updateOne();
      this.newOrder = await createdData.save();

      this.basketService.sendBasketWithCookie(
        res,
        this.newOrder,
        'Заказ успешно изменён',
      );
    }
  }
}
