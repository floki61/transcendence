import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoGuard } from './Guards';

@Controller()
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @UseGuards(FortyTwoGuard)
  @Get('login')
  login(){}

  @UseGuards(FortyTwoGuard)
  @Get('callback')
  AuthRedirect(@Req() req) {
    return this.AuthService.validateuser(req)
  }
}
