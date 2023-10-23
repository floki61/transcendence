import { AuthService } from './auth.service';
import { Response } from 'express';
import { Userdto, signindto } from "../users/dto";
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly config;
    constructor(authService: AuthService, config: ConfigService);
    googlelogin(): void;
    googleAuthRedirect(req: any, res: Response): Promise<void>;
    login(): void;
    authRedirect(req: any, res: Response): Promise<void>;
    logout(req: any, res: Response): Promise<void>;
    signup(data: Userdto): Promise<{
        id: string;
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        picture: string;
        accessToken: string;
        password: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    signin(data: signindto): Promise<{
        id: string;
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        picture: string;
        accessToken: string;
        password: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
