import { Injectable } from '@nestjs/common';
import { BodyDto, OneOrderDto, OrderDto } from '../order/dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../order/schemas/order.schema';
import { TokensService } from 'src/token/tokens.service';
import { Request, Response } from 'express';
import { BasketService } from '../order/basket.service';
import { OneOrder, OrdersUserDto, UpdateData } from './dto/admin.dto';
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

  async getOrders() {
    const data = await this.orderModel.find().exec();
    const selectData = this._selectDataFromOrders(data);
    return selectData;
  }

  async updateOrder(body: UpdateData): Promise<OneOrder> {
    this.deviceId = body.deviceId;
    const order = await this.basketService.getDataByOrderId(body.orderId);
    const imgBody = body.completedImages;
    // добавляет новые либо удаляет существующие значения
    if (imgBody) {
      let images = order.completedImages;
      if (images) {
        if (images.length === 0) {
          images = imgBody;
        } else {
          imgBody.forEach((i) => {
            if (images.includes(i)) {
              images = images.filter((v) => v !== i);
            } else {
              images.push(i);
            }
          });
        }
        order.completedImages = images;
      } else order.completedImages = imgBody;
    }

    if (body.mailAdmin) order.mailAdmin = body.mailAdmin;
    if (body.status) order.status = body.status;

    const data = await this._updateBD(order);
    const selectData = this._selectDataFromOneOrder(order);
    if (data) return selectData;
  }

  async _updateBD(order: OneOrderDto) {
    return await this.orderModel.findOneAndUpdate(
      { orderId: order.orderId },
      order,
    );
  }

  _selectDataFromOneOrder(order: OneOrder): OneOrder {
    const leftDays = order.createdAt ? getLeftDays(order.createdAt, 15) : 0;

    return {
      deviceId: order.deviceId,
      orderId: order.orderId,
      userName: order.userName,
      phone: order.phone,
      mail: order.mail,
      mailAdmin: order.mailAdmin,
      images: order.images,
      service: order.service,
      completedImages: order.completedImages,
      status: order.status,
      created: order.created,
      leftDays,
    };
  }

  _selectDataFromOrders(data: OneOrder[]): OrdersUserDto[] {
    let arr: OrdersUserDto[] = [];
    data.forEach((userOrders) => {
      const deviceId = userOrders.deviceId;
      const newData = this._selectDataFromOneOrder(userOrders);

      const existOrder = arr.find((i) => i.deviceId === deviceId);

      if (existOrder) {
        if (existOrder.data.some((i) => i.orderId !== userOrders.orderId))
          existOrder.data.push(newData);
      } else {
        const ndata: OrdersUserDto = {
          deviceId,
          data: [newData],
        };
        arr.push(ndata);
      }
    });

    return arr;
  }

  async cancelOrder(body: { mailAdmin: string }, orderId: string) {
    const res = await this.orderModel.findOneAndUpdate(
      { orderId },
      {
        mailAdmin: body.mailAdmin,
        completedImages: null,
        images: null,
        mail: '',
        status: 'Отменён',
        expireAt: 1,
      },
    );
    if (res) return 'ok';

    return null;
  }
}
