import { NestFactory } from '@nestjs/core';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as passport from 'passport';

const httpsOptions = {
  key: readFileSync('../security/photostudio.ru+3-key.pem'),
  cert: readFileSync('../security/photostudio.ru+3.pem'),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { httpsOptions });

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

  // app.useGlobalPipes(new ValidationPipe());

  app.use(passport.initialize());

  await app.listen(port);
  console.log(`server listen port ${port}`);
}
bootstrap();
