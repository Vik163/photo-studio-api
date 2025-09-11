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
import { BodyDto, OrderDto, ResOrdersDto } from '../order/dto/order.dto';
import { Request, Response } from 'express';
import { BasketService } from '../order/basket.service';
import { AdminService } from './admin.service';
import { OrdersUserDto } from './dto/admin.dto';

@Controller('admin')
export class AdminController {
  constructor(
    readonly adminService: AdminService,
    private basketService: BasketService,
  ) {}

  @Get('orders')
  async getOrders(): Promise<OrdersUserDto[]> {
    return this.adminService.getOrders();
  }

  @Put()
  async updateOrder(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: BodyDto,
  ): Promise<void> {
    const token: string = req.cookies.__order;
    await this.adminService.updateOrder(res, body, token);
  }

  @Delete(':id')
  async deleteOrder(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<void> {
    const token: string = req.cookies.__order;
    if (token) {
      await this.adminService.deleteOrder(res, token, id);
    }
  }

  // @Put('basket/:id')
  // async decreaseBasket(@Param('id') id: string): Promise<BasketTotalDto> {
  //   return this.orderService.decreaseBasket(id);
  // }

  // @Delete('basket/:id')
  // async deleteBasket(@Param('id') id: string): Promise<BasketTotalDto> {
  //   return this.orderService.deleteBasket(id);
  // }
}
