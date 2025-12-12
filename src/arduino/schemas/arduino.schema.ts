import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SwitchStatus } from '../dto/arduino.dto';

export type ArduinoDocument = HydratedDocument<Arduino>;

@Schema()
export class Arduino {
  @Prop()
  id: string;

  @Prop()
  min?: number[];

  @Prop()
  max?: number[];

  @Prop()
  avr?: number[];

  @Prop()
  thd?: number[];

  @Prop()
  timerOutLight?: string[];

  @Prop()
  outLight: SwitchStatus;
}

export const ArduinoSchema = SchemaFactory.createForClass(Arduino);
