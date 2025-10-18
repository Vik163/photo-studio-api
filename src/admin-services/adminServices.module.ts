import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminServicesController } from './adminServices.controller';
import { AdminServicesService } from './adminServices.service';
import { Services, ServicesSchema } from './schemas/services.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Services.name, schema: ServicesSchema },
    ]),

    JwtModule.register({}),
  ],
  controllers: [AdminServicesController],
  providers: [AdminServicesService],
})
export class AdminServicesModule {}
