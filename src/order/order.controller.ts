import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { Response } from 'express';

@Controller('order')
export class OrderController {
  constructor(readonly orderService: OrderService) {}

  // @Post()
  // async addOrder(@Res() res: Response, @Body() body: OrderDto): Promise<void> {
  //   await this.orderService.addOrder(res, body);
  // }
  @Post()
  async addOrders(@Res() res: Response, @Body() body: OrderDto): Promise<void> {
    await this.orderService.addOrders(res, body);
  }

  // @Get('basket')
  // async getBasket(): Promise<BasketTotalDto> {
  //   return this.orderService.getBasket();
  // }

  // @Put('basket/:id')
  // async decreaseBasket(@Param('id') id: string): Promise<BasketTotalDto> {
  //   return this.orderService.decreaseBasket(id);
  // }

  // @Delete('basket/:id')
  // async deleteBasket(@Param('id') id: string): Promise<BasketTotalDto> {
  //   return this.orderService.deleteBasket(id);
  // }
}
