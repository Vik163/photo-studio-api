import { Injectable } from '@nestjs/common';
import { BodyDto, OrderDto } from '../order/dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../order/schemas/order.schema';
import { TokensService } from 'src/token/tokens.service';
import { Request, Response } from 'express';
import { OneOrder, OrdersUserDto, UpdateData } from './dto/admin.dto';
import { Message } from 'src/messages/schemas/messages.schema';
import { AdminOrderService } from './adminOrder.service';

@Injectable()
export class AdminMailService {
  deviceId: string;
  newOrder: OrderDto;

  constructor(
    @InjectModel(Message.name) private mailModel: Model<Message>,
    private tokenService: TokensService,
    private orderService: AdminOrderService,
  ) {
    this.deviceId = '';
    this.newOrder = null;
  }

  async getMails() {
    const data: OneOrder[] = await this.mailModel.find().exec();
    const selectData = this.orderService._selectDataFromOrders(data);
    return selectData;
  }

  async updateMail(body: UpdateData): Promise<OneOrder | undefined> {
    this.deviceId = body.deviceId;
    const mailData = await this._getMailsByOrderId(body.orderId);

    if (body.mailAdmin) mailData.mailAdmin = body.mailAdmin;

    const data = await this._updateBD(mailData);
    if (data) return mailData;
  }

  async _getMailsByOrderId(orderId: string): Promise<OneOrder> {
    const data: OneOrder = await this.mailModel.findOne({ orderId }).exec();

    return data;
  }

  async _updateBD(message: OneOrder) {
    return await this.mailModel.findOneAndUpdate(
      { orderId: message.orderId },
      message,
    );
  }
}
