import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { AdminOrderService } from './adminOrder.service';
import { OneOrder, OrdersUserDto, UpdateData } from './dto/admin.dto';
import { AdminMailService } from './adminMail.service';
import { AccessToken } from 'src/common/decorators/accessToken.decorator';

@Controller('admin')
export class AdminController {
  constructor(
    readonly adminOrderService: AdminOrderService,
    readonly adminMailService: AdminMailService,
  ) {}

  @AccessToken()
  @Get('orders')
  async getOrders(): Promise<OrdersUserDto[]> {
    return await this.adminOrderService.getOrders();
  }

  @AccessToken()
  @Get('messages')
  async getMails(): Promise<OrdersUserDto[]> {
    return this.adminMailService.getMails();
  }

  @AccessToken()
  @Put()
  async updateData(@Body() body: UpdateData): Promise<OneOrder> {
    const completedImages = body.completedImages;
    if ((completedImages && completedImages.length > 0) || body.status) {
      return await this.adminOrderService.updateOrder(body);
    } else {
      return await this.adminMailService.updateMail(body);
    }
  }

  @AccessToken()
  @Delete('orders/:id')
  async cancelOrder(
    @Param('id') id: string,
    @Body() body: { mailAdmin: string },
  ): Promise<string> {
    return await this.adminOrderService.cancelOrder(body, id);
  }
}
