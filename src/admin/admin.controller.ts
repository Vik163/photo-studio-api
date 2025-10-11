import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { BodyDto, OrderDto } from '../order/dto/order.dto';
import { Request, Response } from 'express';
import { BasketService } from '../order/basket.service';
import { AdminOrderService } from './adminOrder.service';
import { OneOrder, OrdersUserDto, UpdateData } from './dto/admin.dto';
import { AdminMailService } from './adminMail.service';
import { MailDto } from 'src/messages/dto/messages.dto';

@Controller('admin')
export class AdminController {
  constructor(
    readonly adminOrderService: AdminOrderService,
    readonly adminMailService: AdminMailService,
    private basketService: BasketService,
  ) {}

  // @Get('orders')
  // async getOrders(): Promise<OrdersUserDto[]> {
  //   return this.adminOrderService.getOrders();
  // }

  // @Get('messages')
  // async getMails(): Promise<OrdersUserDto[]> {
  //   return this.adminMailService.getMails();
  // }

  // @Put()
  // async updateData(@Body() body: UpdateData): Promise<OneOrder> {
  //   const completedImages = body.completedImages;
  //   if ((completedImages && completedImages.length > 0) || body.status) {
  //     return await this.adminOrderService.updateOrder(body);
  //   } else {
  //     return await this.adminMailService.updateMail(body);
  //   }
  // }

  // @Delete('orders/:id')
  // async cancelOrder(
  //   @Param('id') id: string,
  //   @Body() body: { deviceId: string; mailAdmin: string },
  // ): Promise<string> {
  //   return await this.adminOrderService.cancelOrder(body, id);
  // }
}
