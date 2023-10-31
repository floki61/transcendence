import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
export declare class TwoFactorAuthService {
    private prisma;
    constructor(prisma: PrismaService);
    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User): Promise<boolean>;
    generateQrCodeDataURL(otpAuthUrl: string): Promise<any>;
    setTwoFactorAuthenticationSecret(secret: string, userId: string): Promise<void>;
    generateTwoFactorAuthenticationSecret(userid: any, email: any): Promise<{
        secret: string;
        otpauthUrl: string;
    }>;
    turnOnTwoFactorAuthentication(userId: string): Promise<void>;
}
