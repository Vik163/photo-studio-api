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
import { OrderService } from './order.service';
import { BodyDto, OneOrderDto, ResOrdersDto } from './dto/order.dto';
import { Request, Response } from 'express';
import { BasketService } from './basket.service';

@Controller('orders')
export class OrderController {
  constructor(
    readonly orderService: OrderService,
    private basketService: BasketService,
  ) {}

  @Post()
  async addOrder(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: BodyDto,
  ): Promise<void> {
    const token: string = req.cookies.__order;
    await this.orderService.addOrder(res, body, token);
  }

  @Put()
  async updateOrder(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: BodyDto,
  ): Promise<void> {
    const token: string = req.cookies.__order;
    await this.orderService.updateOrder(res, body, token);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string): Promise<OneOrderDto | null> {
    return await this.orderService.deleteOrder(id);
  }

  @Get('basket')
  async getBasket(@Req() req: Request): Promise<ResOrdersDto[]> {
    const token: string = req.cookies.__order;
    if (token) {
      const answer = await this.basketService.getBasket(token);
      return answer;
    } else return null;
  }
}
