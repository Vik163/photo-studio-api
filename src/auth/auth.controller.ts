import { Controller, Post, Body, Get, Param, Req, Res } from '@nestjs/common';

import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AccessToken } from 'src/common/decorators/accessToken.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // авторизация по паролю ===============================
  @Post()
  async authAdmin(
    @Body() pass: { pass: string },
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.authAdmin(pass, res);
  }

  // Первый запрос на определение пользователя ============
  @AccessToken()
  @Get('auth/:id')
  async getInitialUserById(
    @Param('id') id: string,
    @Req() req: Request,
    // если res, то отправка через res.send(), иначе не возвращает значение
    @Res() res: Response,
  ): Promise<void> {
    // await this.authService.getInitialUserById(id, req, res);
  }
}
