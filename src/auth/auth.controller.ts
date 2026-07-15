import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import express from 'express';
import { AuthService } from './auth.service';
import { SingInDto } from './dto/singin.dto';
import { AuthGuard } from './guard/auth.guard';
import * as jwtPayloadInterface from './interfaces/jwt-payload.interface';
import { TokenPayloadParam } from './params/token-payload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private readonly COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 24 * 60 * 60 * 1000, // 1 dia
  };

  @Post()
  async singIn(
    @Body() singInDto: SingInDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { token } = await this.authService.authenticate(singInDto);
    res.cookie('token', token, this.COOKIE_OPTIONS);
    return { token };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@TokenPayloadParam() payload: jwtPayloadInterface.JwtPayload) {
    return payload;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { message: 'Logout realizado com sucesso' };
  }
}
