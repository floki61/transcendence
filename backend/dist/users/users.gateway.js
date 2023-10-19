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
exports.UsersGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const users_service_1 = require("./users.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const socket_io_1 = require("socket.io");
let UsersGateway = exports.UsersGateway = class UsersGateway {
    constructor(chatService, jwt, config, usr) {
        this.chatService = chatService;
        this.jwt = jwt;
        this.config = config;
        this.usr = usr;
    }
    async handleConnection(client, ...args) {
        console.log('client 1', client.id);
        let cookie;
        let payload;
        if (client.request.headers.cookie) {
            cookie = await this.parseCookies(client.request.headers.cookie);
            payload = await this.jwt.verifyAsync(cookie, {
                secret: this.config.get('secret')
            });
            if (payload.id) {
                client.join(payload.id);
                console.log('payload.sub', payload.id);
            }
        }
        else {
            client.disconnect();
        }
    }
    parseCookies(cookieHeader) {
        const cookies = {};
        if (cookieHeader) {
            cookieHeader.split(';').forEach((cookie) => {
                const parts = cookie.split('=');
                const name = parts.shift()?.trim();
                let value = decodeURI(parts.join('='));
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                if (name) {
                    cookies[name] = value;
                }
            });
        }
        return cookies['access_token'];
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], UsersGateway.prototype, "server", void 0);
exports.UsersGateway = UsersGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'users',
    }),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        users_service_1.UsersService])
], UsersGateway);
//# sourceMappingURL=users.gateway.js.map