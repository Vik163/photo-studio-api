import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { AdminServicesService } from './adminServices.service';
import {
  AdminServicesDto,
  BodyServiceDto,
  TypeServices,
} from './dto/services.dto';

@Controller('admin')
export class AdminServicesController {
  constructor(readonly servicesService: AdminServicesService) {}

  // @Put('services')
  // async editService(@Body() body: BodyServiceDto): Promise<BodyServiceDto> {
  //   return await this.servicesService.editService(body);
  // }

  // @Get('services')
  // async getMessages(): Promise<AdminServicesDto[] | string> {
  //   return await this.servicesService.getServices();
  // }

  // @Delete('services/:id')
  // async deleteMessage(
  //   @Param('id') id: string,
  //   @Query() query: { type: TypeServices },
  // ): Promise<string | null> {
  //   return await this.servicesService.deleteService(query, id);
  // }
}
