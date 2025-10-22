import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { getDates } from 'src/utils/lib/getDates';
import { Response } from 'express';

import { Messages } from 'src/utils/constants/messages';
import { Services } from './schemas/services.schema';
import {
  AdminOneServiceDto,
  AdminServicesDto,
  BodyServiceDto,
  TypeServices,
} from './dto/services.dto';
import { config } from 'src/config/configuration';

@Injectable()
export class AdminServicesService {
  newService: BodyServiceDto;

  constructor(
    @InjectModel(Services.name) private servicesModel: Model<Services>,
  ) {
    this.newService = null;
  }

  /**
   * РЕдактирует услугу
   * если нет в бд, то добавляет, если есть меняет цену (ищет по id услуги).
   * ищет по id услуги
   * отправляет данные клиенту или сообщение об ошибке
   * @param body
   */
  async editService(body: BodyServiceDto): Promise<BodyServiceDto> {
    this.newService = body;
    const id = uuidv4();
    this.newService.id = body.id ? body.id : id;
    const existServices = await this.getServicesByName(body.type);

    if (existServices) {
      const updateData = await this._updateBD(
        existServices,
        Messages.CREATE_SERVICE_ERROR,
      );

      if (updateData) return this.newService;
    } else {
      const newData: AdminServicesDto = {
        type: body.type,
        services: [
          {
            id,
            value: body.value,
            price: body.price,
          },
        ],
      };

      const createdData = new this.servicesModel(newData);
      const res = await createdData.save();

      if (res) {
        return this.newService;
      }
    }
  }

  /**
   * Удаляет по id (id услуги) и query (тип блока) параметрам.
   * возвращает 'ok' или null
   */
  async deleteService(
    query: { type: TypeServices },
    serviceId: string,
  ): Promise<string | null> {
    const data = await this.getServicesByName(query.type);
    const services = data.services;

    const newServices = services.filter((item) => item.id !== serviceId);

    const res = await this.servicesModel.findOneAndUpdate(
      { type: query.type },
      { services: newServices },
    );

    if (res) {
      return 'ok';
    } else {
      return null;
    }
  }

  async getServices(): Promise<AdminServicesDto[] | string> {
    const services = await this.servicesModel.find().exec();

    if (services) {
      return services;
    } else return Messages.GET_SERVICE_ERROR;
  }

  /**
   * по типу "photo-na-dokumenty" | "photo-restavraciya" | "photo-dizain" | "ritual-photo".
   */
  async getServicesByName(name: TypeServices): Promise<AdminServicesDto> {
    const services = await this.servicesModel.findOne({ type: name }).exec();

    if (services) {
      return services;
    } else return null;
  }

  /**
   * Обновляет в бд данные
   * создает объект с новыми данными и обновляет бд по id устройства
   * данные отправляет клиенту, либо сообщение об ошибке
   */
  async _updateBD(services: AdminServicesDto, message: string) {
    let isExist = false;

    const arrServices = services.services;

    arrServices.forEach((item) => {
      if (item.id === this.newService.id) {
        item.price = this.newService.price || item.price;
        isExist = true;
      }
    });

    if (!isExist)
      arrServices.push({
        id: this.newService.id,
        value: this.newService.value,
        price: this.newService.price,
      });

    const res = await this.servicesModel.findOneAndUpdate(
      { type: services.type },
      { services: arrServices },
    );

    if (res) {
      return res;
    } else {
      return message;
    }
  }
}
