import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { AdminOneServiceDto, TypeServices } from '../dto/services.dto';

export type ServicesDocument = HydratedDocument<Services>;

@Schema()
export class Services {
  @Prop()
  type: TypeServices;

  @Prop()
  services: AdminOneServiceDto[];
}

export const ServicesSchema = SchemaFactory.createForClass(Services);
