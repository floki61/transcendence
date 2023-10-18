"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.twoFactorAuthModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("../../users/users.module");
const twofactorauth_service_1 = require("./twofactorauth.service");
const twofactorauth_controller_1 = require("./twofactorauth.controller");
const jwt_1 = require("@nestjs/jwt");
let twoFactorAuthModule = exports.twoFactorAuthModule = class twoFactorAuthModule {
};
exports.twoFactorAuthModule = twoFactorAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule],
        controllers: [twofactorauth_controller_1.TwoFactorAuthController],
        providers: [twofactorauth_service_1.TwoFactorAuthService, jwt_1.JwtService],
    })
], twoFactorAuthModule);
//# sourceMappingURL=twofactorauth.module.js.map