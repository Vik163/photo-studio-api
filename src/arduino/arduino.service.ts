import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Arduino } from './schemas/arduino.schema';
import { Model } from 'mongoose';
import { ArduinoDto } from './dto/arduino.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArduinoService {
  constructor(
    @InjectModel(Arduino.name) private arduinoModel: Model<Arduino>,
  ) {}

  async addData(body: ArduinoDto): Promise<string> {
    const existData = await this.getData();

    if (existData) {
      return await this.updateData(body, existData.id);
    } else {
      body.id = 'stat';
      const createdData = new this.arduinoModel(body);
      const saveData = await createdData.save();

      if (saveData) {
        return 'ok';
      } else return 'no';
    }
  }

  /**
   * достаёт из токена id устройства и ищет существующие сообщения под этим id.
   * выбирает в найденных нужное по id заказа полученного из параметров запроса и удаяет его.
   * отправляет данные клиенту или сообщение об ошибке
   */
  //   async deleteMessage(orderId: string): Promise<OneMailDto | null> {
  //     const message = await this.messageModel
  //       .findOneAndDelete({ orderId })
  //       .exec();

  //     if (message) {
  //       return message;
  //     } else {
  //       return null;
  //     }
  //   }

  async updateData(body: ArduinoDto, id: string): Promise<string> {
    const newData: ArduinoDto = {
      id,
      min: body.min,
      max: body.max,
      avr: body.avr,
      thd: body.thd,
    };
    const updateData = await this.arduinoModel.findOneAndUpdate(
      { id },
      newData,
    );
    if (updateData) {
      return 'ok';
    } else 'no';
  }

  async getData(): Promise<ArduinoDto> {
    const data: ArduinoDto[] = await this.arduinoModel.find().exec();

    return data[0];
  }

  //   /**
  //    * по id устройства удаляет сообщения под этим id.
  //    * проверяет корзину заказов по id устройства. Если есть то посылает клиенту сообщение, если нет то сначала удаляет cookie клиента
  //    */
  //   async _deleteDataByDeviceId(res: Response) {
  //     const data = await this.messageModel
  //       .findOneAndDelete({ deviceId: this.deviceId })
  //       .exec();

  //     const basket = await this.basketService.getDataByDeviceId(this.deviceId);

  //     if (!basket) this.tokenService.deleteToken(res);
  //     if (data) {
  //       res.send({ message: Messages.DELETE_MAIL_SUCCESS });
  //     } else res.send({ message: Messages.DELETE_MAIL_ERROR });
}
