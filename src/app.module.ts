import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { config } from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // вместо localhost 127.0.0.1
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [config],
    }),
    MongooseModule.forRoot(process.env.DB_MONGO),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../public/images'),
    }),
    AuthModule,
    AdminModule,
    OrderModule,
    MessagesModule,
  ],
})
export class AppModule {}
