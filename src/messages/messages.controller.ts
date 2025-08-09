import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Request, Response } from 'express';
import { MailData } from './dto/messages.dto';

@Controller('message')
export class MessagesController {
  constructor(readonly messagesService: MessagesService) {}

  @Post()
  async addMesssage(@Body() body: MailData): Promise<string> {
    console.log(body);
    return await this.messagesService.addMesssage(body);
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
