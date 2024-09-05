import { Response } from 'express';

import { Controller, Post, Request, Res, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // async login(@Request() req) {
  //   let { access_token } = await this.authService.login(req.user);
  //   return { access_token };
  // }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.login(req.user);
    res.cookie('access_token', access_token, {
      httpOnly: true,
    });
    return { message: 'Successfully logged in' };
  }
}
