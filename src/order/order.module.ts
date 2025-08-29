import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensService } from 'src/token/tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { BasketService } from './basket.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    JwtModule.register({}),
  ],
  controllers: [OrderController],
  providers: [OrderService, TokensService, BasketService],
})
export class OrderModule {}
