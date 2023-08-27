import { Controller, Get, Post, Body, Req, UseGuards, Render} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoGuard, GoogleGuard } from './tools/Guards';
import { Request } from 'express';
import { Userdto, signindto } from "../users/dto";



@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleGuard)
  @Get('login/google')
  googlelogin() {}

  @UseGuards(GoogleGuard)
  @Get('/auth/google/callback')
  async googleAuthRedirect(@Req() req) {
    const result = await this.authService.validateuser(req);
    if (result === null) {
        return 'Access token cookie is present';
    }
    else {
      req.res.cookie('access_token', result, { httpOnly: true, maxAge: 600000 });
      req.res.redirect('/home');
    }
  }
  
  @UseGuards(FortyTwoGuard)
  @Get('login')
  login() {}

  @UseGuards(FortyTwoGuard)
  @Get('callback')
  async authRedirect(@Req() req: Request)  {
    const result = await this.authService.validateuser(req);
    if (result === null) {
        return 'Access token cookie is present';
    }
    else {
      req.res.cookie('access_token', result, { httpOnly: true, maxAge: 600000 });
      req.res.redirect('/home');
    }
  }

  @Post('signup')
  signup(@Body() data: Userdto){
  return this.authService.signup(data);
  }
  
  
  @Post('signin')
  signin(@Body() data: signindto){
  return this.authService.signin(data);
  }
}
