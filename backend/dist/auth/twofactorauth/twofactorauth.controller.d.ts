import { Response } from 'express';
import { TwoFactorAuthService } from './twofactorauth.service';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
export declare class TwoFactorAuthController {
    private readonly twoFactorAuth;
    private readonly authService;
    private readonly configService;
    constructor(twoFactorAuth: TwoFactorAuthService, authService: AuthService, configService: ConfigService);
    register(req: any, res: Response): Promise<void>;
    turnOnTwoFactorAuthentication(req: any, body: any): Promise<void>;
    authenticate(req: any, res: any, body: any): Promise<{
        statusCode: number;
        message: string;
        jwt: string;
    }>;
}
