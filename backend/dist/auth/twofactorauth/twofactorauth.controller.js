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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorAuthController = void 0;
const common_1 = require("@nestjs/common");
const twofactorauth_service_1 = require("./twofactorauth.service");
const jwt_guard_1 = require("../jwt/jwt.guard");
const auth_service_1 = require("../auth.service");
const config_1 = require("@nestjs/config");
const _2fa_guard_1 = require("./guard/2fa.guard");
let TwoFactorAuthController = exports.TwoFactorAuthController = class TwoFactorAuthController {
    constructor(twoFactorAuth, authService, configService) {
        this.twoFactorAuth = twoFactorAuth;
        this.authService = authService;
        this.configService = configService;
    }
    async register(req, res) {
        const { otpauthUrl } = await this.twoFactorAuth.generateTwoFactorAuthenticationSecret(req.user.id, req.user.email);
        const qrCodeUrl = await this.twoFactorAuth.generateQrCodeDataURL(otpauthUrl);
        res.send(`${qrCodeUrl}`);
    }
    async turnOnTwoFactorAuthentication(req, body) {
        const isCodeValid = await this.twoFactorAuth.isTwoFactorAuthenticationCodeValid(body.twoFactorAuthenticationCode, req.user);
        if (!isCodeValid)
            throw new common_1.UnauthorizedException('Wrong authentication code');
        else
            console.log("code is valide");
        await this.twoFactorAuth.turnOnTwoFactorAuthentication(req.user.id);
    }
    async turnOffTwoFactorAuthentication(req) {
        console.log("code is valide");
        await this.twoFactorAuth.turnOffTwoFactorAuthentication(req.user.id);
    }
    async authenticate(req, res, body) {
        try {
            const isCodeValid = await this.twoFactorAuth.isTwoFactorAuthenticationCodeValid(body.twoFactorAuthenticationCode, req.user);
            if (!isCodeValid)
                throw new common_1.UnauthorizedException('Wrong authentication code');
            const token = await this.authService.generateToken(req, 'jwt');
            console.log("token");
            return { statusCode: 200, message: 'Authenticated', jwt: token };
        }
        catch (error) {
            console.error("Error validating 2FA code222:", error);
            throw new common_1.UnauthorizedException('Error validating 2FA code');
        }
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('2fa/generate'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/turn-on'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthController.prototype, "turnOnTwoFactorAuthentication", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/turn-off'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthController.prototype, "turnOffTwoFactorAuthentication", null);
__decorate([
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFaAuthGuard),
    (0, common_1.Post)('2fa/authenticate'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthController.prototype, "authenticate", null);
exports.TwoFactorAuthController = TwoFactorAuthController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [twofactorauth_service_1.TwoFactorAuthService,
        auth_service_1.AuthService,
        config_1.ConfigService])
], TwoFactorAuthController);
//# sourceMappingURL=twofactorauth.controller.js.map