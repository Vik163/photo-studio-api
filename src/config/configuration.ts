import { ConfigProps } from 'src/types/config.interface';

export const config = (): ConfigProps => ({
  port: 8000,
  option: [
    'https://photostudio.ru',
    'https://127.0.0.1:3000',
    'https://photosalon.online',
    'https://192.168.0.15',
    'https://192.168.0.16',
  ],
  token_secret: process.env.TOKEN_SECRET,
  control_token_secret: process.env.CONTROL_TOKEN_SECRET,
  admin_token_secret: process.env.ADMIN_TOKEN_SECRET,
  time_token: 60 * 60 * 24 * 1000 * 15,
  api: process.env.API_URL,
  time_live_cancel_order: 15,
  time_live_order: 86400 * 10,
  time_live_mail: 86400 * 5,
});
