import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import {
  Order,
  Orders,
  OrderSchema,
  OrdersSchema,
} from './schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensService } from 'src/token/tokens.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Orders.name, schema: OrdersSchema }]),
    JwtModule.register({}),
  ],
  controllers: [OrderController],
  providers: [OrderService, TokensService],
})
export class OrderModule {}
