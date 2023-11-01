import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { authenticator } from "otplib";
import { toDataURL } from 'qrcode';
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "../auth.service";

@Injectable()

export class TwoFactorAuthService {
    constructor(private prisma: PrismaService,
                private authService: AuthService) {}

    async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
        try {
            const isValid = await authenticator.verify({
                token: twoFactorAuthenticationCode,
                secret: user.twoFactorAuthenticationSecret,
            });
            if (isValid) {
                console.log('2FA code is valid.');
                return true;
            } else {
                console.log('2FA code is not valid.');
                return false;
            }
        } catch (error) {
            console.error('Error validating 2FA code:', error);
            return false;
        }
    }

    async generateQrCodeDataURL(otpAuthUrl: string) {
        return toDataURL(otpAuthUrl);
    }

    async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
        const user = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data:{
                twoFactorAuthenticationSecret: secret
            }
        });
    }

    async generateTwoFactorAuthenticationSecret(userid, email) {
        const secret = authenticator.generateSecret();
        const otpauthUrl = authenticator.keyuri(email, 'transcendence', secret);
        await this.setTwoFactorAuthenticationSecret(secret, userid);
        return {
            secret,
            otpauthUrl
        }
    }
    async turnOnTwoFactorAuthentication(userId: string) {
        const user = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data:{
                isTwoFactorAuthenticationEnabled: true
            }
        });
    }
    async turnOffTwoFactorAuthentication(userId: string) {
        const user = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data:{
                isTwoFactorAuthenticationEnabled: false
            }
        });
    }
}
