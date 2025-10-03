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

  _selectDataFromOrders(data: OrderDto[]): OrdersUserDto[] {
    return data.map((userOrders) => {
      const arrOrders = userOrders.orders.map((order) => {
        const leftDays = getLeftDays(order.createdAt, 15);

        return {
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
      });
      return { deviceId: userOrders.deviceId, data: arrOrders };
    });
  }

  _selectDataFromOneOrder(order: OneOrderDto): OneOrder {
    const leftDays = getLeftDays(order.createdAt, 15);

    return {
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

  async getOrders() {
    const data = await this.orderModel.find().exec();

    const selectData = this._selectDataFromOrders(data);

    console.log('selectData:', selectData);
    return selectData;
  }

  async _deleteDataBydeviceId(res: Response, deviceId: string) {
    const data = await this.orderModel
      .findOneAndDelete({ deviceId: deviceId })
      .exec();
    if (data) this.tokenService.deleteToken(res);
    res.send({ message: 'Заказ успешно удалён' });
  }

  async deleteOrder(res: Response, orderId: string) {
    // const deviceId = await this.tokenService.getPayloadByCookie(token);
    // const data = await this.basketService.getDataByDeviceId(deviceId);
    // if (data.orders.length < 2) {
    //   this._deleteDataBydeviceId(res, deviceId);
    // } else {
    //   data.orders = data.orders.filter((order) => order.orderId !== orderId);
    //   const createdData = new this.orderModel(data);
    //   await createdData.updateOne();
    //   this.newOrder = await createdData.save();
    //   this.basketService.sendBasketWithCookie(
    //     res,
    //     this.newOrder,
    //     'Заказ успешно удалён',
    //   );
    // }
  }

  async updateOrder(body: UpdateData): Promise<OneOrder> {
    console.log('body:', body);
    this.deviceId = body.deviceId;
    const basket = await this.basketService.getDataByDeviceId(this.deviceId);
    const orders = basket.orders;
    const index = orders.findIndex((el) => el.orderId === body.orderId);
    const imgBody = body.completedImages;
    // добавляет новые либо удаляет существующие значения
    if (imgBody) {
      let images = orders[index].completedImages;
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
        orders[index].completedImages = images;
      } else orders[index].completedImages = imgBody;
    }

    if (body.mailAdmin) orders[index].mailAdmin = body.mailAdmin;
    if (body.status) orders[index].status = body.status;

    const data = await this._updateBD(orders);
    const selectData = this._selectDataFromOneOrder(orders[index]);
    if (data) return selectData;
  }

  async _updateBD(orders: OneOrderDto[]) {
    const newData: OrderDto = {
      deviceId: this.deviceId,
      orders,
    };

    return await this.orderModel.findOneAndUpdate(
      { deviceId: this.deviceId },
      newData,
    );
  }
}
