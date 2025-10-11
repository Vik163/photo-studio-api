import { Injectable } from '@nestjs/common';
import { BodyDto, OrderDto } from '../order/dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../order/schemas/order.schema';
import { TokensService } from 'src/token/tokens.service';
import { Request, Response } from 'express';
import { BasketService } from '../order/basket.service';
import { OneOrder, OrdersUserDto, UpdateData } from './dto/admin.dto';
import { getLeftDays } from 'src/utils/lib/getDates';
import { Message } from 'src/messages/schemas/messages.schema';
import { MailDto, OneMailDto } from 'src/messages/dto/messages.dto';

@Injectable()
export class AdminMailService {
  deviceId: string;
  newOrder: OrderDto;

  constructor(
    @InjectModel(Message.name) private mailModel: Model<Message>,
    private tokenService: TokensService,
    private basketService: BasketService,
  ) {
    this.deviceId = '';
    this.newOrder = null;
  }

  // _selectDataFromOrders(data: MailDto[]): OrdersUserDto[] {
  //   return data.map((userOrders) => {
  //     const arrOrders = userOrders.messages.map((order) => {
  //       return {
  //         orderId: order.orderId,
  //         userName: order.userName,
  //         phone: order.phone,
  //         mail: order.mail,
  //         mailAdmin: order.mailAdmin,
  //         created: order.created,
  //       };
  //     });
  //     return { deviceId: userOrders.deviceId, data: arrOrders };
  //   });
  // }

  // async getMails() {
  //   const data: MailDto[] = await this.mailModel.find().exec();

  //   const selectData = this._selectDataFromOrders(data);

  //   return selectData;
  // }

  // async _getMailsByDeviceId(deviceId: string): Promise<MailDto> {
  //   const data: MailDto = await this.mailModel
  //     .findOne({ deviceId: deviceId })
  //     .exec();

  //   return data;
  // }

  // async updateMail(body: UpdateData): Promise<OneOrder | undefined> {
  //   this.deviceId = body.deviceId;
  //   const mailsData = await this._getMailsByDeviceId(this.deviceId);
  //   const messages = mailsData.messages;
  //   const index = messages.findIndex((el) => el.orderId === body.orderId);

  //   if (body.mailAdmin) messages[index].mailAdmin = body.mailAdmin;

  //   const data = await this._updateBD(messages);
  //   if (data) return messages[index];
  // }

  // async _updateBD(messages: OneMailDto[]) {
  //   const newData: MailDto = {
  //     deviceId: this.deviceId,
  //     messages,
  //   };

  //   return await this.mailModel.findOneAndUpdate(
  //     { deviceId: this.deviceId },
  //     newData,
  //   );
  // }
  //   async _deleteDataBydeviceId(res: Response, deviceId: string) {
  //     const data = await this.orderModel
  //       .findOneAndDelete({ deviceId: deviceId })
  //       .exec();
  //     if (data) this.tokenService.deleteToken(res);
  //     res.send({ message: 'Заказ успешно удалён' });
  //   }

  //   async deleteOrder(res: Response, token: string, orderId: string) {
  //     const deviceId = await this.tokenService.getPayloadByCookie(token);
  //     const data = await this.basketService.getDataByDeviceId(deviceId);

  //     if (data.orders.length < 2) {
  //       this._deleteDataBydeviceId(res, deviceId);
  //     } else {
  //       data.orders = data.orders.filter((order) => order.orderId !== orderId);

  //       const createdData = new this.orderModel(data);

  //       await createdData.updateOne();
  //       this.newOrder = await createdData.save();

  //       this.basketService.sendBasketWithCookie(
  //         res,
  //         this.newOrder,
  //         'Заказ успешно удалён',
  //       );
  //     }
  //   }

  //   async updateOrder(res: Response, body: BodyDto, token?: string) {
  //     const deviceId = await this.tokenService.getPayloadByCookie(token);
  //     if (deviceId) {
  //       const basket = await this.basketService.getDataByDeviceId(deviceId);
  //       const orders = basket.orders;
  //       const index = orders.findIndex((el) => el.orderId === body.orderId);

  //       orders[index].images = body.images;
  //       orders[index].mail = body.mail;
  //       orders[index].service = body.service;

  //       const createdData = new this.orderModel(basket);

  //       await createdData.updateOne();
  //       this.newOrder = await createdData.save();

  //       this.basketService.sendBasketWithCookie(
  //         res,
  //         this.newOrder,
  //         'Заказ успешно изменён',
  //       );
  //     }
  //   }
}
