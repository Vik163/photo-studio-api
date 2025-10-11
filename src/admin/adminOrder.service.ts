import { Injectable } from '@nestjs/common';
import { BodyDto, OneOrderDto, OrderDto } from '../order/dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../order/schemas/order.schema';
import { TokensService } from 'src/token/tokens.service';
import { Request, Response } from 'express';
import { BasketService } from '../order/basket.service';
import {
  DataCancelOrder,
  OneOrder,
  OrdersUserDto,
  UpdateData,
} from './dto/admin.dto';
import { getLeftDays } from 'src/utils/lib/getDates';

@Injectable()
export class AdminOrderService {
  deviceId: string;
  newOrder: OrderDto;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private tokenService: TokensService,
    private basketService: BasketService,
  ) {
    this.deviceId = '';
    this.newOrder = null;
  }

  // _selectDataFromOrders(data: OrderDto[]): OrdersUserDto[] {
  //   return data.map((userOrders) => {
  //     const arrOrders = userOrders.orders.map((order) => {
  //       const leftDays = order.createdAt ? getLeftDays(order.createdAt, 15) : 0;

  //       return {
  //         orderId: order.orderId,
  //         userName: order.userName || '',
  //         phone: order.phone || '',
  //         mail: order.mail || '',
  //         mailAdmin: order.mailAdmin,
  //         images: order.images || null,
  //         service: order.service,
  //         completedImages: order.completedImages || null,
  //         status: order.status,
  //         created: order.created,
  //         leftDays,
  //       };
  //     });
  //     return { deviceId: userOrders.deviceId, data: arrOrders };
  //   });
  // }

  // _selectDataFromOneOrder(order: OneOrderDto): OneOrder {
  //   const leftDays = getLeftDays(order.createdAt, 15);

  //   return {
  //     orderId: order.orderId,
  //     userName: order.userName,
  //     phone: order.phone,
  //     mail: order.mail,
  //     mailAdmin: order.mailAdmin,
  //     images: order.images,
  //     service: order.service,
  //     completedImages: order.completedImages,
  //     status: order.status,
  //     created: order.created,
  //     leftDays,
  //   };
  // }
  // _setDataCancelOrder(order: OneOrderDto, mailAdmin: string): DataCancelOrder {
  //   let expireAt = new Date();
  //   expireAt.setMinutes(expireAt.getMinutes() + Math.round(Math.random() * 10));
  //   return {
  //     deviceId: order.deviceId,
  //     orderId: order.orderId,
  //     mailAdmin,
  //     service: order.service,
  //     status: 'Отменён',
  //     created: order.created,
  //     expireAt: 1,
  //   };
  // }

  // async getOrders() {
  //   const data = await this.orderModel.find().exec();

  //   // const selectData = this._selectDataFromOrders(data);

  //   return data;
  // }

  // async cancelOrder(
  //   body: { deviceId: string; mailAdmin: string },
  //   orderId: string,
  // ) {
  //   this.deviceId = body.deviceId;
  //   const basket = await this.basketService.getDataByDeviceId(this.deviceId);
  //   const orders = basket;

  //   const newOrders = orders.map((item) => {
  //     if (item.orderId === orderId) {
  //       item = this._setDataCancelOrder(item, body.mailAdmin);
  //     }
  //     return item;
  //   });
  //   console.log('newOrders:', newOrders);

  //   const res = await this.orderModel.findOneAndUpdate(
  //     { deviceId: this.deviceId },
  //     { orders: newOrders },
  //   );
  //   if (res) return 'ok';

  //   return null;
  // }

  // async updateOrder(body: UpdateData): Promise<OneOrder> {
  //   this.deviceId = body.deviceId;
  //   const basket = await this.basketService.getDataByDeviceId(this.deviceId);
  //   const orders = basket;
  //   const index = orders.findIndex((el) => el.orderId === body.orderId);
  //   const imgBody = body.completedImages;
  //   // добавляет новые либо удаляет существующие значения
  //   if (imgBody) {
  //     let images = orders[index].completedImages;
  //     if (images) {
  //       if (images.length === 0) {
  //         images = imgBody;
  //       } else {
  //         imgBody.forEach((i) => {
  //           if (images.includes(i)) {
  //             images = images.filter((v) => v !== i);
  //           } else {
  //             images.push(i);
  //           }
  //         });
  //       }
  //       orders[index].completedImages = images;
  //     } else orders[index].completedImages = imgBody;
  //   }

  //   if (body.mailAdmin) orders[index].mailAdmin = body.mailAdmin;
  //   if (body.status) orders[index].status = body.status;

  //   const data = await this._updateBD(orders);
  //   const selectData = this._selectDataFromOneOrder(orders[index]);
  //   if (data) return selectData;
  // }

  // async _updateBD(orders: OneOrderDto[]) {
  //   const newData: OrderDto = {
  //     deviceId: this.deviceId,
  //     orders,
  //   };

  //   return await this.orderModel.findOneAndUpdate(
  //     { deviceId: this.deviceId },
  //     newData,
  //   );
  // }
}
