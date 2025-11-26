import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArduinoController } from './arduino.controller';

@Module({
  imports: [
    //  MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [ArduinoController],
  providers: [],
})
export class ArduinoModule {}
