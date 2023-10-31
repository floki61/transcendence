"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorAuthService = void 0;
const common_1 = require("@nestjs/common");
const otplib_1 = require("otplib");
const qrcode_1 = require("qrcode");
const prisma_service_1 = require("../../prisma/prisma.service");
const auth_service_1 = require("../auth.service");
let TwoFactorAuthService = exports.TwoFactorAuthService = class TwoFactorAuthService {
    constructor(prisma, authService) {
        this.prisma = prisma;
        this.authService = authService;
    }
    async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, user) {
        try {
            const isValid = await otplib_1.authenticator.verify({
                token: twoFactorAuthenticationCode,
                secret: user.twoFactorAuthenticationSecret,
            });
            if (isValid) {
                console.log('2FA code is valid.');
                return true;
            }
            else {
                console.log('2FA code is not valid.');
                return false;
            }
        }
        catch (error) {
            console.error('Error validating 2FA code:', error);
            return false;
        }
    }
    async generateQrCodeDataURL(otpAuthUrl) {
        return (0, qrcode_1.toDataURL)(otpAuthUrl);
    }
    async setTwoFactorAuthenticationSecret(secret, userId) {
        const user = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                twoFactorAuthenticationSecret: secret
            }
        });
    }
    async generateTwoFactorAuthenticationSecret(userid, email) {
        const secret = otplib_1.authenticator.generateSecret();
        const otpauthUrl = otplib_1.authenticator.keyuri(email, 'transcendence', secret);
        await this.setTwoFactorAuthenticationSecret(secret, userid);
        return {
            secret,
            otpauthUrl
        };
    }
    async turnOnTwoFactorAuthentication(userId) {
        const user = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                isTwoFactorAuthenticationEnabled: true
            }
        });
    }
};
exports.TwoFactorAuthService = TwoFactorAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auth_service_1.AuthService])
], TwoFactorAuthService);
//# sourceMappingURL=twofactorauth.service.js.map