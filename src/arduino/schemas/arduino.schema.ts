import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

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
}

export const ArduinoSchema = SchemaFactory.createForClass(Arduino);
