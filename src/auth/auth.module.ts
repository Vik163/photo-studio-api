import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TokensService } from 'src/token/tokens.service';
import { BasketService } from 'src/order/basket.service';
import { MessagesService } from 'src/messages/messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/order/schemas/order.schema';
import { Message, MessageSchema } from 'src/messages/schemas/messages.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    // объект пустой, так как ключ не один
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokensService, BasketService, MessagesService],
})
export class AuthModule {}
