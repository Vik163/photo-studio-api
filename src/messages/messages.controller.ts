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
import { BodyMailDto, MailData } from './dto/messages.dto';

@Controller('messages')
export class MessagesController {
  constructor(readonly messagesService: MessagesService) {}

  @Post()
  async addMesssage(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: MailData,
  ): Promise<void> {
    const token: string = req.cookies.__order;
    await this.messagesService.addMessage(res, body, token);
  }

  @Get()
  async getMessages(@Res() res: Response, @Req() req: Request): Promise<void> {
    const token: string = req.cookies.__order;
    await this.messagesService.getMessages(res, token);
  }

  @Delete(':id')
  async deleteMessage(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<void> {
    const token: string = req.cookies.__order;
    if (token) {
      await this.messagesService.deleteMessage(res, token, id);
    }
  }

  @Put()
  async updateMessage(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: BodyMailDto,
  ): Promise<void> {
    const token: string = req.cookies.__order;
    if (token) {
      await this.messagesService.updateMessages(res, token, body);
    }
  }
}
