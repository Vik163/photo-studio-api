import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokensService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async getToken(userId: string): Promise<string> {
    const payload = { userId };

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('token_secret'),
      expiresIn: this.configService.get<string>('time_token'),
    });
  }

  async canActivate(
    userId: string,
    req: Request,
    res: Response,
  ): Promise<boolean> {
    const token: string = req.cookies.__order;

    // const user: UserDto = await this.userService.findById(userId);
    if (!token) {
      console.log('no');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('token_secret'),
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      payload;
    } catch {
      console.log('no');
    }
    return true;
  }

  async sendToken(res: Response, id: string): Promise<boolean> {
    const token = await this.getToken(id);
    if (token) {
      res
        .cookie('__order', token, {
          secure: true,
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 1000 * 15,
        })
        .send('ok');
      return true;
    } else {
      return false;
    }
  }

  // Выход ===================================================================
  async deleteToken(res: Response) {
    res.clearCookie('__order');
    res.end();
  }
}
