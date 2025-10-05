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
import { AdminServicesService } from './adminServices.service';
import { AdminServicesDto } from './dto/services.dto';

@Controller('admin')
export class AdminServicesController {
  constructor(readonly servicesService: AdminServicesService) {}

  @Post('services')
  async addService(@Body() body: AdminServicesDto): Promise<void> {
    //  await this.messagesService.addMessage(body);
  }

  //   @Get()
  //   async getMessages(@Res() res: Response, @Req() req: Request): Promise<void> {
  //     const token: string = req.cookies.__order;
  //     await this.messagesService.getMessages(res, token);
  //   }

  //   @Delete(':id')
  //   async deleteMessage(
  //     @Res() res: Response,
  //     @Req() req: Request,
  //     @Param('id') id: string,
  //   ): Promise<void> {
  //     const token: string = req.cookies.__order;
  //     if (token) {
  //       await this.messagesService.deleteMessage(res, token, id);
  //     }
  //   }

  //   @Put()
  //   async updateMessage(
  //     @Res() res: Response,
  //     @Req() req: Request,
  //     @Body() body: UpdateMailDto,
  //   ): Promise<void> {
  //     const token: string = req.cookies.__order;
  //     if (token) {
  //       await this.messagesService.updateMessages(res, token, body);
  //     }
  //   }
}
