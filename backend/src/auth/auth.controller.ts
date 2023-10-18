import { Controller, Get, Post, Body, Req, UseGuards, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoGuard, GoogleGuard } from './tools/Guards';
import { Request, Response, response} from 'express';
import { Userdto, signindto } from "../users/dto";
import { JwtAuthGuard } from './jwt/jwt.guard';

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(GoogleGuard)
	@Get('login/google')
	googlelogin() {}

	@UseGuards(GoogleGuard)
	@Get('/auth/google/callback')
	async googleAuthRedirect(@Req() req, @Res() res: Response) {
		await this.authService.validateUser(req, res);
		// if(req.user.isTwoFactorAuthenticationCodeValid)
			// res.redirect('2fa/generate');
		res.redirect('http://localhost:3000/settings');
	}
	
	@UseGuards(FortyTwoGuard)
	@Get('login')
	login() {}
	
	@UseGuards(FortyTwoGuard)
	@Get('callback')
	async authRedirect(@Req() req, @Res() res: Response) {
		await this.authService.validateUser(req, res)
		// if(req.user.isTwoFactorAuthenticationEnabled)
			// res.redirect('2fa/generate');
		res.redirect('http://localhost:3000/settings');
	}

	@Post('signup')
	signup(@Body() data: Userdto) {
	return this.authService.signup(data);
	}

	@Post('signin')
	signin(@Body() data: signindto){
	return this.authService.signin(data);
	}
}	
