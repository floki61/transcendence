import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { FortyTwoGuard } from './Guards';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(FortyTwoGuard)
  @Get('login')
  login(){}

  @UseGuards(FortyTwoGuard)
  @Get('callback')
  AuthRedirect(@Req() req) {
    return this.appService.validateuser(req)
  }
}
