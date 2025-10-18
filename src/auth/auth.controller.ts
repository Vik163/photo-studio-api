import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // авторизация по паролю ===============================
  @Post('admin/auth')
  async authAdmin(
    @Body() pass: { pass: string },
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.authAdmin(pass, res);
  }

  // авторизация клиента по номеру телефона ===============================
  @Post('auth')
  async authClient(
    @Body() data: { phone: string },
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.authClient(data, res);
  }
}
