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
import { UpdateMailDto, MailData, OneMailDto } from './dto/messages.dto';

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
  async deleteMessage(@Param('id') id: string): Promise<OneMailDto | null> {
    return await this.messagesService.deleteMessage(id);
  }

  @Put()
  async updateMessage(
    @Res() res: Response,
    @Body() body: UpdateMailDto,
  ): Promise<void> {
    await this.messagesService.updateMessage(res, body);
  }
}
