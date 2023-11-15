import { Controller, Get, Post, Body, Req, UseGuards, Res, ConsoleLogger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoGuard, GoogleGuard } from './tools/Guards';
import { Request, Response} from 'express';
import { Userdto, signindto } from "../users/dto";
import { JwtAuthGuard } from './jwt/jwt.guard';
import { get } from 'http';
import { ConfigService } from '@nestjs/config';
import { clearConfigCache } from 'prettier';
import { UsersService } from 'src/users/users.service';

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService,
		private readonly config: ConfigService,
		private readonly userService: UsersService,
	) { }

	@UseGuards(GoogleGuard)
	@Get('login/google')
	googlelogin() { }

	@UseGuards(GoogleGuard)
	@Get('google/callback')
	async googleAuthRedirect(@Req() req, @Res() res: Response) {
		if (await this.authService.validateUser(req, res)) {
			const user = await this.userService.getUser(req.user.id);
			if (user.isTwoFactorAuthenticationEnabled)
				res.redirect(this.config.get('2FA_URL'));
			else
				res.redirect(this.config.get('HOME_URL'));
		}
		else
			res.redirect(this.config.get('SETTINGS_URL'));
	}

	@UseGuards(FortyTwoGuard)
	@Get('login')
	login() { }

	@UseGuards(FortyTwoGuard)
	@Get('callback')
	async authRedirect(@Req() req, @Res() res: Response) {
		if (await this.authService.validateUser(req, res)) {
			const user = await this.userService.getUser(req.user.id);
			if(user.isDeleted)
				res.redirect(this.config.get('LOGIN_URL'));
			else if (user.isTwoFactorAuthenticationEnabled)
				res.redirect(this.config.get('2FA_URL'));
			else
				res.redirect(this.config.get('HOME_URL'));

		}
		else
			res.redirect(this.config.get('SETTINGS_URL'));
	}
	@UseGuards(JwtAuthGuard)
	@Get('logout')
	async logout(@Req() req, @Res() res: Response) {
		await this.authService.logout(req, res);
		res.redirect(this.config.get('LOGIN_URL'));
	}
	@Post('signup')
	signup(@Body() data: Userdto) {
		return this.authService.signup(data);
	}

	@Post('signin')
	signin(@Body() data: signindto) {
		return this.authService.signin(data);
	}
}	
