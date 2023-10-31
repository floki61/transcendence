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
const auth_service_1 = require("../auth.service");
const users_service_1 = require("../../users/users.service");
const _2fa_strategy_1 = require("./guard/2fa.strategy");
const passport_1 = require("@nestjs/passport");
const _2fa_guard_1 = require("./guard/2fa.guard");
let twoFactorAuthModule = exports.twoFactorAuthModule = class twoFactorAuthModule {
};
exports.twoFactorAuthModule = twoFactorAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule,
            passport_1.PassportModule.register({ defaultStrategy: '2fa' }),
        ],
        controllers: [twofactorauth_controller_1.TwoFactorAuthController],
        providers: [twofactorauth_service_1.TwoFactorAuthService, jwt_1.JwtService, auth_service_1.AuthService, users_service_1.UsersService, _2fa_strategy_1.TwoFaStrategy, _2fa_guard_1.TwoFaAuthGuard],
    })
], twoFactorAuthModule);
//# sourceMappingURL=twofactorauth.module.js.map