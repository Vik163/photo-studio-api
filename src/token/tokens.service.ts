import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

interface TokenPayload {
  deviceId: string;
  iat: number;
  exp: number;
}

@Injectable()
export class TokensService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async getAdminTokens(): Promise<{
    adminToken: string;
    controlToken: string;
  }> {
    const adminId = uuidv4();

    const payload = { adminId };

    const adminToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('admin_token_secret'),
    });
    const controlToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('control_token_secret'),
    });

    return { adminToken, controlToken };
  }

  async getToken(deviceId: string): Promise<string> {
    if (deviceId) {
      const payload = { deviceId };

      return await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('token_secret'),
        expiresIn: this.configService.get<string>('time_token'),
      });
    }
    return '';
  }

  async getPayloadByCookie(token: string): Promise<string | null> {
    const payload: TokenPayload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('token_secret'),
    });

    if (payload) {
      return payload.deviceId;
    } else {
      return null;
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
    }
  }

  async sendAdminTokens(res: Response): Promise<void> {
    const { controlToken, adminToken } = await this.getAdminTokens();
    if (Boolean(adminToken) && Boolean(controlToken)) {
      res
        .cookie('__secure_admin', adminToken, {
          secure: true,
          httpOnly: true,
          sameSite: 'strict',
        })
        .cookie('control_admin', controlToken, {
          secure: true,
          sameSite: 'strict',
        })
        .send({ message: 'Авторизован' });
    } else {
      this.deleteAdminTokens(res);
    }
  }

  // Выход ===================================================================
  async deleteToken(res: Response) {
    res.clearCookie('__order');
  }

  async deleteAdminTokens(res: Response) {
    res
      .clearCookie('__secure_admin')
      .clearCookie('control_admin')
      .send({ message: 'Не авторизован' });
  }
}
