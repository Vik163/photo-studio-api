import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/messages.schema';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TokensService } from 'src/token/tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { BasketService } from 'src/order/basket.service';
import { Order, OrderSchema } from 'src/order/schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    JwtModule.register({}),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, TokensService, BasketService],
})
export class MessagesModule {}
