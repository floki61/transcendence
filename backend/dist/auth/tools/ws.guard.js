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
exports.WsGuard = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let WsGuard = exports.WsGuard = class WsGuard {
    constructor(userService, jwt, config) {
        this.userService = userService;
        this.jwt = jwt;
        this.config = config;
    }
    canActivate(context) {
        const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
        try {
            const decoded = this.jwt.verify(bearerToken, this.config.get("JWT_SECRET_KEY"));
            return new Promise((resolve, reject) => {
                return this.userService.getUser(decoded.id).then(user => {
                    if (user) {
                        resolve(user);
                    }
                    else {
                        reject(false);
                    }
                });
            });
        }
        catch (ex) {
            console.log(ex);
            return false;
        }
    }
};
exports.WsGuard = WsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], WsGuard);
//# sourceMappingURL=ws.guard.js.map