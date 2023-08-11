import { Controller, Get, Req, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoGuard } from './tools/Guards';
import { Request} from 'express';



@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
