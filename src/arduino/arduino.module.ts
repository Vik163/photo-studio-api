import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArduinoController } from './arduino.controller';
import { Arduino, ArduinoSchema } from './schemas/arduino.schema';
import { ArduinoService } from './arduino.service';
import { CustomLogger } from 'src/common/logger/customLogger';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Arduino.name, schema: ArduinoSchema }]),
  ],
  controllers: [ArduinoController],
  providers: [ArduinoService, CustomLogger],
})
export class ArduinoModule {}
