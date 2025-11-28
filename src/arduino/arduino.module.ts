import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArduinoController } from './arduino.controller';
import { Arduino, ArduinoSchema } from './schemas/arduino.schema';
import { ArduinoService } from './arduino.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Arduino.name, schema: ArduinoSchema }]),
  ],
  controllers: [ArduinoController],
  providers: [ArduinoService],
})
export class ArduinoModule {}
