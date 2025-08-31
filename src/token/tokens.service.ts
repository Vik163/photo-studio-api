import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

@Injectable()
export class TokensService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async getToken(userId: string): Promise<string> {
    if (userId) {
      const payload = { userId };

      return await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('token_secret'),
        expiresIn: this.configService.get<string>('time_token'),
      });
    }
    return '';
  }

  async getPayloadByCookie(token: string): Promise<string> {
    const payload: TokenPayload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('token_secret'),
    });

    if (payload) {
      return payload.userId;
    } else {
      console.log('no');
      return 'no';
    }
  }

  async sendToken(res: Response, id: string): Promise<boolean> {
    const token = await this.getToken(id);
    if (Boolean(token)) {
      res.cookie('__order', token, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: this.configService.get<number>('time_token'),
      });
      return true;
    } else {
      return false;
    }
  }

  // Выход ===================================================================
  async deleteToken(res: Response) {
    res.clearCookie('__order');
  }

  //   async canActivate(
  //   userId: string,
  //   req: Request,
  //   res: Response,
  // ): Promise<boolean> {
  //   const token: string = req.cookies.__order;

  //   // const user: UserDto = await this.userService.findById(userId);
  //   if (!token) {
  //     console.log('no');
  //   }
  //   try {
  //     const payload = await this.jwtService.verifyAsync(token, {
  //       secret: this.configService.get<string>('token_secret'),
  //     });
  //     // 💡 We're assigning the payload to the request object here
  //     // so that we can access it in our route handlers
  //     payload;
  //   } catch {
  //     console.log('no');
  //   }
  //   return true;
  // }
}
