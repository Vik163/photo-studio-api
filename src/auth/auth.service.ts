import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { TokensService } from 'src/token/tokens.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(private readonly tokensService: TokensService) {}

  // получаем пользователя по id или возвращаем "не найден"
  // получаем время хранения =====================================================
  async authAdmin(pass: { pass: string }, res: Response): Promise<void> {
    if (pass.pass === process.env.ADMIN_PASSWORD) {
      this.tokensService.sendAdminTokens(res);
    } else this.tokensService.deleteAdminTokens(res);
  }
}
