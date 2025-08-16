import { ConfigProps } from 'src/types/config.interface';

export const config = (): ConfigProps => ({
  port: 8000,
  option: [
    'https://photostudio.ru',
    'https://127.0.0.1:3000',
    'https://photosalon.online',
  ],
  token_secret: process.env.TOKEN_SECRET,
  time_token: 15,
  // host
  api: process.env.API_URL,
});
