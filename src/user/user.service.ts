import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Response } from 'express';
import { TokensService } from './tokens.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly tokenService: TokensService,
  ) {}

  async getUser(numberPhone: string): Promise<UserDto> {
    return await this.userModel.findOne({ phone: numberPhone }).exec();
  }

  async createUser(user: UserDto): Promise<void> {
    const createdData = new this.userModel(user);
    await createdData.save();
  }
}
