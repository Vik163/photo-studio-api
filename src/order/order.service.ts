import { Injectable } from '@nestjs/common';
import { OneOrderDto, OrderDto, OrdersDto } from './dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, Orders } from './schemas/order.schema';
import { v4 as uuidv4 } from 'uuid';
import { TokensService } from 'src/token/tokens.service';
import { Response } from 'express';

@Injectable()
export class OrderService {
  userPhone: string;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Orders.name) private ordersModel: Model<Orders>,
    private tokenService: TokensService,
  ) {
    this.userPhone = '';
  }

  async addOrder(res: Response, body: OrderDto): Promise<void> {
    this.userPhone = body.phone;
    const newDate = new Date();
    const orderDto: OrderDto = {
      _id: uuidv4(),
      name: body.name,
      phone: this.userPhone,
      type: body.type,
      message: body.message,
      images: body.images,
      service: body.service,
      status: 'Принят',
      createdAt: newDate,
    };

    const createdData = new this.orderModel(orderDto);
    await createdData.save();

    const token = await this.tokenService.getToken(this.userPhone);
    if (token) {
      const arrData = await this.getOrders();

      const data = arrData.map((order) => {
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

  async addOrders(res: Response, body: OrderDto): Promise<void> {
    console.log('body:', body.images);
    this.userPhone = body.phone;
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

    const existOrders = await this.getOrderss();

    if (existOrders) {
      const order: OneOrderDto = {
        message: body.message,
        images: body.images,
        service: body.service,
        status: 'Принят',
        createdAt: newDate,
      };

      existOrders.orders.push(order);

      const createdData = new this.ordersModel(existOrders);

      await createdData.updateOne();
      await createdData.save();
    } else {
      const order: OrdersDto = {
        _id: uuidv4(),
        name: body.name,
        phone: this.userPhone,
        orders: [
          {
            message: body.message,
            images: body.images,
            service: body.service,
            status: 'Принят',
            createdAt: newDate,
          },
        ],
      };
      const createdData = new this.ordersModel(order);
      await createdData.save();
    }

    const token = await this.tokenService.getToken(this.userPhone);
    if (token) {
      const arrData = await this.getOrderss();

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

  async getOrders(): Promise<OrderDto[]> {
    return await this.orderModel.find({ phone: this.userPhone }).exec();
  }
  async getOrderss(): Promise<OrdersDto> {
    return await this.ordersModel.findOne({ phone: this.userPhone }).exec();
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
