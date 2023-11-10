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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const chat_service_1 = require("./chat.service");
const jwt_guard_1 = require("../auth/jwt/jwt.guard");
const chat_gateway_1 = require("./chat.gateway");
const role_decorator_1 = require("../decorators/role.decorator");
const roles_guard_1 = require("../decorators/roles.guard");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatController = exports.ChatController = class ChatController {
    constructor(config, jwt, userservice, chatgtw, prisma) {
        this.config = config;
        this.jwt = jwt;
        this.userservice = userservice;
        this.chatgtw = chatgtw;
        this.prisma = prisma;
    }
    async createRoom(body, req) {
        const user = await this.userservice.createRoom(body);
        return user;
    }
    async joinRoom(body, req) {
        const user = await this.userservice.joinRoom(body);
        return user;
    }
    async banUser(body, req) {
        const user = await this.userservice.banUser(body);
        return user;
    }
    async unbanUser(body, req) {
        const user = await this.userservice.unbanUser(body);
        return user;
    }
    async kickUser(body, req) {
        const user = await this.userservice.kickUser(body);
        return user;
    }
    async getAllRoom(req) {
        const rooms = await this.userservice.getAllRoom();
        return rooms;
    }
    async getMessages(body, req) {
        const messages = await this.userservice.getMessages(body);
        return messages;
    }
    async deleteRoom(body, req) {
        const room = await this.userservice.deleteRoom(body);
        return room;
    }
    async changeVisibility(body, req) {
        const room = await this.userservice.changeVisibility(body);
        return room;
    }
    async changeRoomName(body, req) {
        const room = await this.userservice.changeRoomName(body);
        return room;
    }
    async muteUser(body, req) {
        const room = await this.userservice.muteUser(body);
        return room;
    }
    async unmuteUser(body, req) {
        const room = await this.userservice.unmuteUser(body);
        return room;
    }
    async changePassword(body, req) {
        const room = await this.userservice.changePassword(body);
        return room;
    }
    async giveAdmin(body, req) {
        const room = await this.userservice.giveAdmin(body);
        return room;
    }
    async getMyRooms(req) {
        const rooms = await this.userservice.getMyRooms({ id: req.user.id });
        for (var room of rooms) {
            if (room.is_DM) {
                room.picture = await this.userservice.getUserPicture(req.user.id === room.participants[0].uid ? room.participants[1].uid : room.participants[0].uid);
            }
            delete room.participants;
        }
        return rooms;
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('createRoom'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createRoom", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('joinRoom'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "joinRoom", null);
__decorate([
    (0, role_decorator_1.Roles)('ADMIN', 'OWNER'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('banUser'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "banUser", null);
__decorate([
    (0, role_decorator_1.Roles)('ADMIN', 'OWNER'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('unbanUser'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "unbanUser", null);
__decorate([
    (0, role_decorator_1.Roles)('ADMIN', 'OWNER'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('kickUser'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "kickUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('getAllRooms'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getAllRoom", null);
__decorate([
    (0, common_1.Post)('getMessages'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMessages", null);
__decorate([
    (0, role_decorator_1.Roles)('OWNER'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('deleteRoom'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteRoom", null);
__decorate([
    (0, role_decorator_1.Roles)('OWNER'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('changeVisibility'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "changeVisibility", null);
__decorate([
    (0, role_decorator_1.Roles)('OWNER'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('changeRoomName'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "changeRoomName", null);
__decorate([
    (0, role_decorator_1.Roles)('OWNER', 'ADMIN'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('muteUser'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "muteUser", null);
__decorate([
    (0, role_decorator_1.Roles)('OWNER', 'ADMIN'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('unmuteUser'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "unmuteUser", null);
__decorate([
    (0, role_decorator_1.Roles)('OWNER'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('changePassword'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "changePassword", null);
__decorate([
    (0, role_decorator_1.Roles)('OWNER'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('giveAdmin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "giveAdmin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('myRooms'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMyRooms", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService,
        chat_service_1.ChatService,
        chat_gateway_1.ChatGateway,
        prisma_service_1.PrismaService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map