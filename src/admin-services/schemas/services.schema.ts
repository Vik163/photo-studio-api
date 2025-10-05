import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { AdminOneServiceDto } from '../dto/services.dto';

export type ServicesDocument = HydratedDocument<Services>;

@Schema()
export class Services {
  @Prop()
  'photo-na-dokumenty'?: AdminOneServiceDto[];

  @Prop()
  'photo-restavraciya'?: AdminOneServiceDto[];

  @Prop()
  'photo-dizain'?: AdminOneServiceDto[];

  @Prop()
  'retual-photo'?: AdminOneServiceDto[];
}

export const ServicesSchema = SchemaFactory.createForClass(Services);
