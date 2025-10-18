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
import { AccessToken } from 'src/common/decorators/accessToken.decorator';

@Controller('admin')
export class AdminServicesController {
  constructor(readonly servicesService: AdminServicesService) {}

  @AccessToken()
  @Put('services')
  async editService(@Body() body: BodyServiceDto): Promise<BodyServiceDto> {
    return await this.servicesService.editService(body);
  }

  @Get('services')
  async getServices(): Promise<AdminServicesDto[] | string> {
    return await this.servicesService.getServices();
  }

  @AccessToken()
  @Delete('services/:id')
  async deleteService(
    @Param('id') id: string,
    @Query() query: { type: TypeServices },
  ): Promise<string | null> {
    return await this.servicesService.deleteService(query, id);
  }
}
