import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { Userdto, signindto } from "../users/dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    googlelogin(): void;
    googleAuthRedirect(req: any, res: Response): Promise<void>;
    login(): void;
    authRedirect(req: any, res: Response): Promise<void>;
    home(req: any): Promise<{
        user: any;
        cookies: any;
    }>;
    signup(data: Userdto, req: Request, res: Response): Promise<{
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
