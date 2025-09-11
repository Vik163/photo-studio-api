import { Module } from '@nestjs/common';
import { Order, OrderSchema } from '../order/schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensService } from 'src/token/tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { BasketService } from '../order/basket.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    JwtModule.register({}),
  ],
  controllers: [AdminController],
  providers: [AdminService, TokensService, BasketService],
})
export class AdminModule {}
