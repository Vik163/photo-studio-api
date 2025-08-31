import { Injectable } from '@nestjs/common';
import { BodyDto, OneOrderDto, OrderDto, ResOrdersDto } from './dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { v4 as uuidv4 } from 'uuid';
import { TokensService } from 'src/token/tokens.service';
import { Request, Response } from 'express';
import { BasketService } from './basket.service';

@Injectable()
export class OrderService {
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

  async addOrder(res: Response, body: BodyDto, token?: string): Promise<void> {
    const date = new Date();
    const monthString = (date.getMonth() + 1).toString();
    const month = monthString.length === 1 ? `0${monthString}` : monthString;
    const newDate = `${date.getDate()}. ${month}`;
    let existOrders: OrderDto = undefined;

    if (token) {
      this.userId = await this.tokenService.getPayloadByCookie(token);
      existOrders = await this.basketService.getDataByUserId(this.userId);
    } else existOrders = await this.basketService.getDataByPhone(body.phone);

    if (existOrders) {
      this.userId = existOrders.userId;

      const order: OneOrderDto = {
        orderId: body.orderId,
        name: body.name,
        phone: body.phone,
        message: body.message,
        images: body.images,
        service: body.service,
        status: 'Создан',
        createdAt: newDate,
      };

      existOrders.orders.push(order);

      const createdData = new this.orderModel(existOrders);

      await createdData.updateOne();
      this.newOrder = await createdData.save();
    } else {
      this.userId = uuidv4();
      const order: OrderDto = {
        userId: this.userId,
        orders: [
          {
            orderId: body.orderId,
            name: body.name,
            phone: body.phone,
            message: body.message,
            images: body.images,
            service: body.service,
            status: 'Создан',
            createdAt: newDate,
          },
        ],
      };
      const createdData = new this.orderModel(order);
      this.newOrder = await createdData.save();
    }

    this.basketService.sendBasketWithCookie(
      res,
      this.newOrder,
      'Заказ успешно создан',
    );
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
