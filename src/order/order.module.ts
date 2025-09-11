import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensService } from 'src/token/tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { BasketService } from './basket.service';
import { Message, MessageSchema } from 'src/messages/schemas/messages.schema';
import { MessagesService } from 'src/messages/messages.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),

    JwtModule.register({}),
  ],
  controllers: [OrderController],
  providers: [OrderService, TokensService, BasketService, MessagesService],
})
export class OrderModule {}
