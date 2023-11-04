import { Controller, Get, Post, Body, Req, UseGuards, Res, UnauthorizedException, HttpCode} from '@nestjs/common';
import { Response} from 'express';
import { TwoFactorAuthService } from './twofactorauth.service';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { TwoFaAuthGuard } from './guard/2fa.guard';
import { clearConfigCache } from 'prettier';

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
		const isCodeValid = await this.twoFactorAuth.isTwoFactorAuthenticationCodeValid(body.twoFactorAuthenticationCode, req.user);
		if (!isCodeValid)
			throw new UnauthorizedException('Wrong authentication code');
		else
      console.log("code is valide");
	  await this.twoFactorAuth.turnOnTwoFactorAuthentication(req.user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Post('2fa/turn-off')
	async turnOffTwoFactorAuthentication(@Req() req: any) {
		// const isCodeValid = await this.twoFactorAuth.isTwoFactorAuthenticationCodeValid(body.twoFactorAuthenticationCode, req.user);
	// 	if (!isCodeValid)
	// 		throw new UnauthorizedException('Wrong authentication code');
	// 	else
      console.log("code is valide");
	  await this.twoFactorAuth.turnOffTwoFactorAuthentication(req.user.id);
	}


	@UseGuards(TwoFaAuthGuard)
	@Post('2fa/authenticate')
	@HttpCode(200)
	async authenticate(@Req() req, @Body() body) {
    try {
      const isCodeValid = await this.twoFactorAuth.isTwoFactorAuthenticationCodeValid(body.twoFactorAuthenticationCode, req.user);
      if (!isCodeValid)
        throw new UnauthorizedException('Wrong authentication code');
      const token = await this.authService.generateToken(req, 'jwt');
      console.log("token");
      return { statusCode: 200, message: 'Authenticated', jwt:  token};
    }
    catch (error) {
      console.error("Error validating 2FA code222:", error);
      throw new UnauthorizedException('Error validating 2FA code');
    }
	}
}
