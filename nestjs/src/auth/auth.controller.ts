import { Controller, Get, Post, Body, Req, UseGuards, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoGuard, GoogleGuard } from './tools/Guards';
import { Request, Response} from 'express';
import { Userdto, signindto } from "../users/dto";
import { generate } from 'rxjs';



@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(GoogleGuard)
	@Get('login/google')
	googlelogin() {}

	@UseGuards(GoogleGuard)
	@Get('/auth/google/callback')
	async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
		if (await this.authService.validateUser(req))
			req.res.redirect('/');
		else {
			const token = await this.authService.generateToken(req);
			res.cookie('access_token', token, { httpOnly: true, maxAge: 600000});
			res.redirect('/');
		}
	}

	@UseGuards(FortyTwoGuard)
	@Get('login')
	login() {}

	@UseGuards(FortyTwoGuard)
	@Get('callback')
	async authRedirect(@Req() req: Request, @Res() res: Response) {
		if (await this.authService.validateUser(req))
			req.res.redirect('/');
	  	else {
			const token = await this.authService.generateToken(req);
			res.cookie('access_token', token, { httpOnly: true, maxAge: 600000});
			res.redirect('/');
		}
	}
	@Get('/')
	async home(@Req() req: Request) {
		return (req.cookies);
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
