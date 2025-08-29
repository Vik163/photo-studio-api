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
import { BodyDto, OrderDto, ResOrdersDto } from './dto/order.dto';
import { Request, Response } from 'express';
import { BasketService } from './basket.service';

@Controller('order')
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

  @Put(':id')
  async dupdateOrder(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: BodyDto,
    @Param('id') id: string,
  ): Promise<void> {
    const token: string = req.cookies.__order;
    await this.orderService.updateOrder(res, body, token);
  }

  @Delete(':id')
  async deleteOrder(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<void> {
    const token: string = req.cookies.__order;
    if (token) {
      await this.orderService.deleteOrder(res, token, id);
    }
  }

  @Get('basket')
  async getBasket(@Req() req: Request): Promise<ResOrdersDto[]> {
    const token: string = req.cookies.__order;
    if (token) {
      const answer = await this.basketService.getBasket(token);
      return answer;
    } else return null;
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
