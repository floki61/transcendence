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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const Guards_1 = require("./tools/Guards");
const dto_1 = require("../users/dto");
const jwt_guard_1 = require("./jwt/jwt.guard");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
let AuthController = exports.AuthController = class AuthController {
    constructor(authService, config, userService) {
        this.authService = authService;
        this.config = config;
        this.userService = userService;
    }
    googlelogin() { }
    async googleAuthRedirect(req, res) {
        if (await this.authService.validateUser(req, res)) {
            res.redirect(this.config.get('HOME_URL'));
        }
        else
            res.redirect(this.config.get('SETTINGS_URL'));
    }
    login() { }
    async authRedirect(req, res) {
        if (await this.authService.validateUser(req, res)) {
            const user = await this.userService.getUser(req.user.id);
            if (user.isTwoFactorAuthenticationEnabled)
                res.redirect(this.config.get('2FA_URL'));
            else
                res.redirect(this.config.get('HOME_URL'));
        }
        else
            res.redirect(this.config.get('SETTINGS_URL'));
    }
    async logout(req, res) {
        await this.authService.logout(req, res);
        res.redirect(this.config.get('LOGIN_URL'));
    }
    signup(data) {
        return this.authService.signup(data);
    }
    signin(data) {
        return this.authService.signin(data);
    }
};
__decorate([
    (0, common_1.UseGuards)(Guards_1.GoogleGuard),
    (0, common_1.Get)('login/google'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googlelogin", null);
__decorate([
    (0, common_1.UseGuards)(Guards_1.GoogleGuard),
    (0, common_1.Get)('google/callback'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.UseGuards)(Guards_1.FortyTwoGuard),
    (0, common_1.Get)('login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(Guards_1.FortyTwoGuard),
    (0, common_1.Get)('callback'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authRedirect", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.Userdto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.signindto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signin", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService,
        users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map