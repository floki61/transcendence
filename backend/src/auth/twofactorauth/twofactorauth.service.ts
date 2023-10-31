import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { authenticator } from "otplib";
import { toDataURL } from 'qrcode';
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()

export class TwoFactorAuthService {
    constructor(private prisma: PrismaService) {}

    async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
        return authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret: user.twoFactorAuthenticationSecret,
        });
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
}
