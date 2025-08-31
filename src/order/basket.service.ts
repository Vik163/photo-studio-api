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

  async getDataByPhone(userPhone: string): Promise<OrderDto> {
    const data = await this.orderModel.findOne({ phone: userPhone }).exec();
    return data;
  }

  async getDataByUserId(userId: string): Promise<OrderDto> {
    const data = await this.orderModel.findOne({ userId: userId }).exec();
    return data;
  }

  _selectData(order: Order) {
    const selectData = order.orders.map((item) => {
      delete item.phone;

      return item;
    });
    return selectData;
  }

  async getBasketByUserId(userId: string): Promise<OneOrderDto[]> {
    const order = await this.getDataByUserId(userId);
    if (order) {
      const selectData = this._selectData(order);
      return selectData;
    } else return null;
  }

  async sendBasketWithCookie(
    res: Response,
    newOrder: OrderDto,
    message: string,
  ) {
    if (newOrder) {
      const order = await this.getBasketByUserId(newOrder.userId);

      const response = await this.tokenService.sendToken(res, newOrder.userId);
      if (response) {
        res.send(order);
      } else res.send({ message });
    }
  }

  async getBasket(token: string): Promise<ResOrdersDto[]> {
    const userId = await this.tokenService.getPayloadByCookie(token);
    if (userId) {
      return await this.getBasketByUserId(userId);
    }
  }
}
