import { Module } from '@nestjs/common';
import { Order, OrderSchema } from '../order/schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensService } from 'src/token/tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { BasketService } from '../order/basket.service';
import { AdminController } from './admin.controller';
import { AdminOrderService } from './adminOrder.service';
import { AdminMailService } from './adminMail.service';
import { Message, MessageSchema } from 'src/messages/schemas/messages.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    JwtModule.register({}),
  ],
  controllers: [AdminController],
  providers: [
    AdminOrderService,
    AdminMailService,
    TokensService,
    BasketService,
  ],
})
export class AdminModule {}
