import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as passport from 'passport';

// const httpsOptions = {
//   key: readFileSync('../security/photostudio.ru+3-key.pem'),
//   cert: readFileSync('../security/photostudio.ru+3.pem'),
// };
//https://api.telegram.org/bot8086716133:AAG5ln4XXztQ9lWlDWGmYm1zKCNrwb35hvY/sendMessage?chat_id=5118278868&text=ТЕКСТ_МОЕГО_СООБЩЕНИЯ

// NestExpressApplication добавляю, чтобы получать простой текст в запросах (по умолчанию отсутствует)
// rawBody: true, - опции приложения
// app.useBodyParser('text'); - добавляет text (text/plain)
// request.body - получаем
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    // httpsOptions,
  });

  const configService = app.get(ConfigService);

  const port = configService.get<number>('port');
  const option = configService.get<string[]>('option');

  app.enableCors();
  //
  app.use(cookieParser());

  app.use(
    cors({
      origin: option,
      methods: 'HEAD,PUT,POST,DELETE,OPTIONS',
      credentials: true,
    }),
  );

  app.useBodyParser('text');

  // app.useGlobalPipes(new ValidationPipe());

  app.use(passport.initialize());

  await app.listen(port);
  console.log(`server listen port ${port}`);
}
bootstrap();
