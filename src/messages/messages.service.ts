import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/messages.schema';
import { Model } from 'mongoose';
import { MailData, MessagesDto } from './dto/messages.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async addMesssage(body: MailData): Promise<string> {
    const id = uuidv4();
    const newDate = new Date();
    const messagesDto: MessagesDto = {
      _id: id,
      name: body.name,
      phone: body.phone,
      message: body.message,
      createdAt: newDate,
    };
    const createdData = new this.messageModel(messagesDto);
    await createdData.save();

    const isSaved = await this.getMessage(id);

    if (isSaved) {
      return 'saved';
    } else return 'no saved';
  }

  async getMessage(id: string) {
    return await this.messageModel.findById({ _id: id }).exec();
  }

  // async getBasket(): Promise<BasketTotalDto> {
  //   const basketProducts: BasketDto[] = await this.basketRepository.find();
  //   let totalPrice = 0;

  //   if (basketProducts.length > 0) {
  //     totalPrice = basketProducts.reduce(
  //       (sum, item) => sum + item.totalPrice,
  //       totalPrice,
  //     );
  //   }

  //   return { basketProducts, totalPrice };
  // }

  // async decreaseBasket(id: string): Promise<BasketTotalDto> {
  //   const product: BasketDto = await this.basketRepository.findOne({
  //     where: { id: id },
  //   });

  //   if (product) {
  //     product.quantity = product.quantity - 1;
  //     product.totalPrice = product.price * product.quantity;
  //   }

  //   const basketDto: BasketDto = await this.basketRepository.save(product);

  //   if (basketDto) {
  //     return this.getBasket();
  //   }
  // }

  // async deleteBasket(id: string): Promise<BasketTotalDto> {
  //   const product: BasketDto = await this.basketRepository.findOne({
  //     where: { id: id },
  //   });
  //   if (product) {
  //     const deleteProduct = await this.basketRepository.remove(product);

  //     if (deleteProduct) {
  //       return this.getBasket();
  //     }
  //   }
  // }
}
