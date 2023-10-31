"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const chat_gateway_1 = require("./chat.gateway");
const prisma_service_1 = require("../prisma/prisma.service");
const prisma_module_1 = require("../prisma/prisma.module");
const jwt_1 = require("@nestjs/jwt");
const chat_controller_1 = require("./chat.controller");
const users_service_1 = require("../users/users.service");
const config_1 = require("@nestjs/config");
let ChatModule = exports.ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule,
            jwt_1.JwtModule.register({}),
        ],
        providers: [chat_gateway_1.ChatGateway, chat_service_1.ChatService, prisma_service_1.PrismaService, users_service_1.UsersService, jwt_1.JwtService, config_1.ConfigService],
        controllers: [chat_controller_1.ChatController],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map