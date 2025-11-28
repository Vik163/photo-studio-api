import { ObjectId } from 'mongoose';

export class ArduinoDto {
  id: string;
  min?: number[];
  max?: number[];
  avr?: number[];
  thd?: number[];
}
