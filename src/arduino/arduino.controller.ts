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
import { Request, Response } from 'express';

@Controller('ard')
export class ArduinoController {
  constructor() {}

  //   @Post()
  //   async addMesssage(
  //     @Res() res: Response,
  //     @Req() req: Request,
  //     @Body() body: MailData,
  //   ): Promise<void> {
  //   }

  @Get()
  async getMessages(): Promise<string> {
    console.log('io');

    return 'this.messagesService';
  }

  //   @Delete(':id')
  //   async deleteMessage(@Param('id') id: string): Promise<OneMailDto | null> {
  //     return await this.messagesService.deleteMessage(id);
  //   }

  //   @Put()
  //   async updateMessage(
  //     @Res() res: Response,
  //     @Body() body: UpdateMailDto,
  //   ): Promise<void> {
  //     await this.messagesService.updateMessage(res, body);
  //   }
}
