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
import { ArduinoDto } from './dto/arduino.dto';
import { ArduinoService } from './arduino.service';

@Controller('ard')
export class ArduinoController {
  constructor(private arduinoService: ArduinoService) {}

  @Post()
  async addData(@Body() body: ArduinoDto): Promise<string> {
    return await this.arduinoService.addData(body);
  }

  @Get()
  async getData(): Promise<ArduinoDto> {
    return await this.arduinoService.getData();
  }

  @Post('auth')
  async login(
    @Req() req: Request,
    @Body() body: string,
  ): Promise<{ auth: boolean }> {
    const secret = req.headers['authorization'];
    const token = `${body}:${secret}`;
    return await this.arduinoService.login(token);
  }

  @Post('push')
  async sendPush(@Req() req: Request): Promise<void> {
    const text = req.body;
    await fetch(
      `https://api.telegram.org/bot${process.env.ARD_TELEG_TOKEN}/sendMessage?chat_id=${process.env.ARD_TELEG_ID}&text=${text}`,
    );
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
