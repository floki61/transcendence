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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const chat_service_1 = require("./chat.service");
const create_chat_dto_1 = require("./dto/create-chat.dto");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
let ChatGateway = exports.ChatGateway = class ChatGateway {
    constructor(chatService, jwt, config, event) {
        this.chatService = chatService;
        this.jwt = jwt;
        this.config = config;
        this.event = event;
        this.map = new Map();
    }
    async handleConnection(client) {
        let cookie;
        let payload;
        if (client.request.headers.cookie) {
            cookie = await this.parseCookies(client.request.headers.cookie);
            payload = await this.jwt.verifyAsync(cookie, {
                secret: this.config.get('JWT_SECRET_KEY')
            });
            if (payload.id) {
                console.log("chat socket : ", payload.id);
                this.map.set(payload.id, client);
            }
            else {
                client.disconnect();
            }
            const rooms = await this.chatService.getUniqueMyRooms(payload);
            if (rooms) {
                (rooms).forEach((room) => {
                    client.join(room.id);
                });
            }
        }
        else {
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        let cookie;
        let payload;
        if (client.request.headers.cookie) {
            cookie = await this.parseCookies(client.request.headers.cookie);
            payload = await this.jwt.verifyAsync(cookie, {
                secret: this.config.get('JWT_SECRET_KEY')
            });
            if (payload.id) {
                this.map.delete(payload.id);
            }
        }
        const rooms = this.chatService.getMyRooms(payload);
        if (rooms) {
            (await rooms).forEach((room) => {
                client.leave(room.id);
            });
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
    async create(createChatDto, client) {
        const message = await this.chatService.create(createChatDto, client);
        this.server.to(createChatDto.rid).emit('message', message);
        this.updateChatRooms({ uid: message.uid });
        return message;
    }
    async joinRoom(payload) {
        if (this.map.has(payload.uid))
            this.map.get(payload.uid).join(payload.rid);
    }
    kickUser(payload) {
        if (this.map.has(payload.uid))
            this.map.get(payload.uid).leave(payload.rid);
    }
    banUser(payload, client) {
        if (this.map.has(payload.uid))
            this.map.get(payload.uid).leave(payload.rid);
    }
    unbanUser(payload, client) {
        if (this.map.has(payload.uid))
            this.map.get(payload.uid).join(payload.rid);
    }
    leaveRoom(payload, client) {
        if (this.map.has(payload.uid))
            this.map.get(payload.uid).leave(payload.rid);
    }
    async updateStatus(payload) {
    }
    async updateChatRooms(payload) {
        const rooms = await this.chatService.getMyRooms(payload);
        this.server.emit('chatRoomsUpdated', rooms);
        return rooms;
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('createChat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_dto_1.CreateChatDto, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "create", null);
__decorate([
    (0, event_emitter_1.OnEvent)('joinRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "joinRoom", null);
__decorate([
    (0, event_emitter_1.OnEvent)('kickUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "kickUser", null);
__decorate([
    (0, event_emitter_1.OnEvent)('banUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "banUser", null);
__decorate([
    (0, event_emitter_1.OnEvent)('unbanUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "unbanUser", null);
__decorate([
    (0, event_emitter_1.OnEvent)('leaveRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "leaveRoom", null);
__decorate([
    (0, event_emitter_1.OnEvent)('endgame'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "updateStatus", null);
__decorate([
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "updateChatRooms", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'chat',
        cors: { origin: 'http://localhost:3000', credentials: true },
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        jwt_1.JwtService,
        config_1.ConfigService,
        event_emitter_1.EventEmitter2])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map