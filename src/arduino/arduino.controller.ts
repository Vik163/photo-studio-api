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
    console.log(body);

    return await this.arduinoService.addData(body);
  }

  @Get()
  async getData(): Promise<ArduinoDto> {
    return await this.arduinoService.getData();
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
