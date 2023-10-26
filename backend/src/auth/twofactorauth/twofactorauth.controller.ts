import { Controller, Get, Post, Body, Req, UseGuards, Res, UnauthorizedException, HttpCode} from '@nestjs/common';
import { Request, Response, response} from 'express';
import { TwoFactorAuthService } from './twofactorauth.service';
import { JwtAuthGuard } from '../jwt/jwt.guard';

@Controller()
export class TwoFactorAuthController {
	constructor(private readonly twoFactorAuth: TwoFactorAuthService) {}

	
	@UseGuards(JwtAuthGuard)
	@Get('2fa/generate')
	async register(@Req() req, @Res() res: Response){
		const {otpauthUrl} = await this.twoFactorAuth.generateTwoFactorAuthenticationSecret(req.user.id, req.user.email);
		const qrCodeUrl = await this.twoFactorAuth.generateQrCodeDataURL(otpauthUrl);
		// res.sendFile(qrCodeUrl);
		// return `<img src=${qrCodeUrl}>`
		res.send(`${qrCodeUrl}`);
	}
	
	@Post('2fa/turn-on')
	@UseGuards(JwtAuthGuard)
	async turnOnTwoFactorAuthentication(@Req() req, @Body() body) {
		console.log(body.twoFactorAuthenticationCode);
		const isCodeValid = await this.twoFactorAuth.isTwoFactorAuthenticationCodeValid(body.twoFactorAuthenticationCode, req.user);
		if (!isCodeValid)
		{
			console.log("wal3alam2");
			throw new UnauthorizedException('Wrong authentication code');
			console.log("wal3alam3");
		}
		else
			console.log("code is valide");
		console.log("walzabi")
	  	await this.twoFactorAuth.turnOnTwoFactorAuthentication(req.user.id);
	}

	@Post('2fa/authenticate')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async authenticate(@Req() req, @Body() body) {
		const isCodeValid = this.twoFactorAuth.isTwoFactorAuthenticationCodeValid(body.twoFactorAuthenticationCode, req.user);	
		if (!isCodeValid)
			throw new UnauthorizedException('Wrong authentication code');
		// return this.authenticationService.loginWith2fa(req.user);
	}
}
