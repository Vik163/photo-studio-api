import { Injectable } from '@nestjs/common';
import { BodyDto, OneOrderDto, OrderDto } from './dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { v4 as uuidv4 } from 'uuid';
import { TokensService } from 'src/token/tokens.service';
import { Response } from 'express';

@Injectable()
export class OrderService {
  _id: string;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private tokenService: TokensService,
  ) {
    this._id = '';
  }

  // async addOrder(res: Response, body: OrderDto): Promise<void> {
  //   this.userPhone = body.phone;
  //   const newDate = new Date();
  //   const orderDto: OrderDto = {
  //     _id: uuidv4(),
  //     name: body.name,
  //     phone: this.userPhone,
  //     type: body.type,
  //     message: body.message,
  //     images: body.images,
  //     service: body.service,
  //     status: 'Принят',
  //     createdAt: newDate,
  //   };

  //   const createdData = new this.orderModel(orderDto);
  //   await createdData.save();

  //   const token = await this.tokenService.getToken(this.userPhone);
  //   if (token) {
  //     const arrData = await this.getOrders();

  //     const data = arrData.map((order) => {
  //       return { service: order.service, status: order.status };
  //     });
  //     res
  //       .cookie('__order', token, {
  //         secure: true,
  //         httpOnly: true,
  //         sameSite: 'strict',
  //         maxAge: 60 * 60 * 24 * 1000 * 15,
  //       })
  //       .send({ data });
  //   }
  // }

  async addOrder(res: Response, body: BodyDto): Promise<void> {
    console.log('body:', body);
    const newDate = new Date();
    // const orderDto: OrderDto = {
    //   _id: uuidv4(),
    //   name: body.name,
    //   phone: this.userPhone,
    //   type: body.type,
    //   message: body.message,
    //   images: body.images,
    //   service: body.service,
    //   status: 'Принят',
    //   createdAt: newDate,
    // };

    const existOrders = await this.getOrders();

    if (existOrders) {
      this._id = existOrders._id;

      const order: OneOrderDto = {
        orderId: body.orderId,
        message: body.message,
        images: body.images,
        service: body.service,
        status: 'Принят',
        createdAt: newDate,
      };

      existOrders.orders.push(order);

      const createdData = new this.orderModel(existOrders);

      await createdData.updateOne();
      await createdData.save();
    } else {
      this._id = uuidv4();
      const order: OrderDto = {
        _id: this._id,
        name: body.name,
        phone: body.phone,
        orders: [
          {
            orderId: body.orderId,
            message: body.message,
            images: body.images,
            service: body.service,
            status: 'Принят',
            createdAt: newDate,
          },
        ],
      };
      const createdData = new this.orderModel(order);
      await createdData.save();
    }

    const token = await this.tokenService.getToken(this._id);
    if (token) {
      const arrData = await this.getOrders();

      const data = arrData.orders.map((order) => {
        return { service: order.service, status: order.status };
      });
      res
        .cookie('__order', token, {
          secure: true,
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 1000 * 15,
        })
        .send({ data });
    }
  }

  async getOrders(): Promise<OrderDto> {
    return await this.orderModel.findOne({ _id: this._id }).exec();
  }

  // async getUser(numberPhone: string): Promise<UserDto> {
  //   return await this.userModel.findOne({ phone: numberPhone }).exec();
  // }

  // async createUser(user: UserDto): Promise<void> {
  //   const createdData = new this.userModel(user);
  //   await createdData.save();
  // }

  // async decreaseBasket(id: string): Promise<BasketTotalDto> {
  //   const product: BasketDto = await this.basketRepository.findOne({
  //     where: { id: id },
  //   });

  //   if (product) {
  //     product.quantity = product.quantity - 1;
  //     product.totalPrice = product.price * product.quantity;
  //   }

  //   const basketDto: BasketDto = await this.basketRepository.save(product);

  //   if (basketDto) {
  //     return this.getBasket();
  //   }
  // }

  // async deleteBasket(id: string): Promise<BasketTotalDto> {
  //   const product: BasketDto = await this.basketRepository.findOne({
  //     where: { id: id },
  //   });
  //   if (product) {
  //     const deleteProduct = await this.basketRepository.remove(product);

  //     if (deleteProduct) {
  //       return this.getBasket();
  //     }
  //   }
  // }
}
