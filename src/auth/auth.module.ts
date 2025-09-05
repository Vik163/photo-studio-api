import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TokensService } from 'src/token/tokens.service';

@Module({
  imports: [
    // объект пустой, так как ключ не один
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokensService],
})
export class AuthModule {}
