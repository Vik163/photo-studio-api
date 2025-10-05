import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminServicesController } from './adminServices.controller';
import { AdminServicesService } from './adminServices.service';
import { Services, ServicesSchema } from './schemas/services.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Services.name, schema: ServicesSchema },
    ]),
  ],
  controllers: [AdminServicesController],
  providers: [AdminServicesService],
})
export class AdminServicesModule {}
