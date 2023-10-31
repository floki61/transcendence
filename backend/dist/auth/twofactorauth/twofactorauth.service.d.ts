import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "../auth.service";
export declare class TwoFactorAuthService {
    private prisma;
    private authService;
    constructor(prisma: PrismaService, authService: AuthService);
    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User): Promise<boolean>;
    generateQrCodeDataURL(otpAuthUrl: string): Promise<any>;
    setTwoFactorAuthenticationSecret(secret: string, userId: string): Promise<void>;
    generateTwoFactorAuthenticationSecret(userid: any, email: any): Promise<{
        secret: string;
        otpauthUrl: string;
    }>;
    turnOnTwoFactorAuthentication(userId: string): Promise<void>;
}
