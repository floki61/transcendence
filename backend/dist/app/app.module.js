"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("../users/users.module");
const twofactorauth_module_1 = require("../auth/twofactorauth/twofactorauth.module");
const app_service_1 = require("./app.service");
const FortyTwoStrategy_1 = require("../auth/tools/FortyTwoStrategy");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_service_1 = require("../auth/auth.service");
const app_controller_1 = require("./app.controller");
const auth_controller_1 = require("../auth/auth.controller");
const chat_module_1 = require("../chat/chat.module");
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const users_controller_1 = require("../users/users.controller");
const users_service_1 = require("../users/users.service");
const users_gateway_1 = require("../users/users.gateway");
const event_emitter_1 = require("@nestjs/event-emitter");
const game_controller_1 = require("../game/game.controller");
const game_module_1 = require("../game/game.module");
const game_gateway_1 = require("../game/game.gateway");
const exception_filter_1 = require("../filter_ex/exception_filter");
const game_service_1 = require("../game/game.service");
const twofactorauth_service_1 = require("../auth/twofactorauth/twofactorauth.service");
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            twofactorauth_module_1.twoFactorAuthModule,
            platform_express_1.MulterModule.register({ dest: './uploads' }),
            prisma_module_1.PrismaModule,
            jwt_1.JwtModule.register({}),
            chat_module_1.ChatModule,
            event_emitter_1.EventEmitterModule.forRoot(),
            game_module_1.GameModule,
        ],
        controllers: [app_controller_1.AppController, auth_controller_1.AuthController, game_controller_1.GameController, users_controller_1.UsersController],
        providers: [jwt_1.JwtService, app_service_1.AppService, FortyTwoStrategy_1.FortyTwoStrategy, prisma_service_1.PrismaService, auth_service_1.AuthService, config_1.ConfigService, users_service_1.UsersService, twofactorauth_service_1.TwoFactorAuthService,
            {
                provide: core_1.APP_FILTER,
                useClass: exception_filter_1.ExceptionsFilter,
            },
            users_gateway_1.UsersGateway,
            game_gateway_1.GameGateway,
            game_service_1.GameService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map