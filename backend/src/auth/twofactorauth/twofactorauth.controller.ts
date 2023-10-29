import { Controller, Get, Post, Body, Req, UseGuards, Res, UnauthorizedException, HttpCode} from '@nestjs/common';
import { Request, Response, response} from 'express';
import { TwoFactorAuthService } from './twofactorauth.service';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { TwoFaAuthGuard } from './guard/2fa.guard';

@Controller()
export class TwoFactorAuthController {
	constructor(private readonly twoFactorAuth: TwoFactorAuthService,
				private readonly authService: AuthService,
				private readonly configService: ConfigService) {}

	
	@UseGuards(JwtAuthGuard)
	@Get('2fa/generate')
	async register(@Req() req, @Res() res: Response){
		const {otpauthUrl} = await this.twoFactorAuth.generateTwoFactorAuthenticationSecret(req.user.id, req.user.email);
		const qrCodeUrl = await this.twoFactorAuth.generateQrCodeDataURL(otpauthUrl);
		// res.sendFile(qrCodeUrl);
		// return `<img src=${qrCodeUrl}>`
		res.send(`${qrCodeUrl}`);
	}
	
	@UseGuards(JwtAuthGuard)
	@Post('2fa/turn-on')
	async turnOnTwoFactorAuthentication(@Req() req, @Body() body) {
		console.log(body.twoFactorAuthenticationCode);
		const isCodeValid = await this.twoFactorAuth.isTwoFactorAuthenticationCodeValid(body.twoFactorAuthenticationCode, req.user);
		if (!isCodeValid)
			throw new UnauthorizedException('Wrong authentication code');
		else
			console.log("code is valide");
	  	await this.twoFactorAuth.turnOnTwoFactorAuthentication(req.user.id);
	}

	@UseGuards(TwoFaAuthGuard)
	@Post('2fa/authenticate')
	@HttpCode(200)
	async authenticate(@Req() req, @Res() res,@Body() body) {
		console.log('wwwww');
		console.log(req.user);
		const isCodeValid = this.twoFactorAuth.isTwoFactorAuthenticationCodeValid(body.twoFactorAuthenticationCode, req.user);	
		if (!isCodeValid)
			throw new UnauthorizedException('Wrong authentication code');
		const token = await this.authService.generateToken(req, 'jwt');
		res.cookie('access_token', token, { httpOnly: true, maxAge: 600000});
		res.redirect(this.configService.get('HOME_URL'));
	}
}
