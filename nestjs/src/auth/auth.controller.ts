// import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { FortyTwoGuard } from './Guards';
// import { Request, Response } from 'express';

// @Controller()
// export class AuthController {
//   constructor(private readonly AuthService: AuthService) {}

//   @UseGuards(FortyTwoGuard)
//   @Get('login')
//   login(){}

//   @UseGuards(FortyTwoGuard)
//   @Get('callback')
//   async AuthRedirect(@Req() req: Request) {
//     const result = await this.AuthService.validateuser(req);
//     if(result === "already created")
//       return "gg";
//     else
//       	req.res.cookie('access_token', result, { httpOnly: true, maxAge: 600000 });
//   }
// }

import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoGuard } from './Guards';
import { Request, Response } from 'express';



@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(FortyTwoGuard)
  @Get('login')
  login() {}

  @UseGuards(FortyTwoGuard)
  @Get('callback')
  async authRedirect(@Req() req: Request) {
    const result = await this.authService.validateuser(req);
    if (result === 'already created') {
      if (req.cookies && req.cookies['access_token']) {
        return 'Access token cookie is present';
      } else {
        return 'Access token cookie is not present';
      }
    } else {
      req.res.cookie('access_token', result, { httpOnly: true, maxAge: 600000 });
      req.res.redirect('/');
    }
  }
  @Get('/')
  hey(){
    return 'User created and access token set';
  }
}
