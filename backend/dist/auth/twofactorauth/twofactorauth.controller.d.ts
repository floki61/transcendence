import { Response } from 'express';
import { TwoFactorAuthService } from './twofactorauth.service';
export declare class TwoFactorAuthController {
    private readonly twoFactorAuth;
    constructor(twoFactorAuth: TwoFactorAuthService);
    register(req: any, res: Response): Promise<void>;
    turnOnTwoFactorAuthentication(req: any, body: any): Promise<void>;
    authenticate(req: any, body: any): Promise<void>;
}
