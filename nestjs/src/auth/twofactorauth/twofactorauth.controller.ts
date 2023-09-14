import { Controller, Get, Post, Body, Req, UseGuards, Res} from '@nestjs/common';
import { Request, Response, response} from 'express';
import { TwoFactorAuthService } from './twofactorauth.service';
import { JwtAuthGuard } from '../jwt/jwt.guard';

@Controller()
export class TwoFactorAuthController {
	constructor(private readonly authService: TwoFactorAuthService) {}

	@UseGuards(JwtAuthGuard)
	@Post('2fa/generate')
	async register(@Req() req, @Res() res: Response){
		const {otpauthUrl} = await this.authService.generateTwoFactorAuthenticationSecret(req.user.id, req.user.email);
		const qrCodeUrl = await this.authService.generateQrCodeDataURL(otpauthUrl);
		return res.json(`<img src=${qrCodeUrl}>`);
		// return res.json(await this.authService.generateQrCodeDataURL(otpauthUrl));
	}
}
