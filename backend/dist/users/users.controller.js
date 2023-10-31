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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("./users.service");
const jwt_guard_1 = require("../auth/jwt/jwt.guard");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const users_gateway_1 = require("./users.gateway");
let UsersController = exports.UsersController = class UsersController {
    constructor(config, jwt, userservice, usergtw) {
        this.config = config;
        this.jwt = jwt;
        this.userservice = userservice;
        this.usergtw = usergtw;
    }
    async home(req) {
        return ({ user: req.user, cookies: req.cookies });
    }
    async getUser(req) {
        return (req.user);
    }
    userSettings(req, data) {
        return this.userservice.updateUser(req, data);
    }
    async sendFriendRequest(body, req) {
        if (req.user.id == req.body.friendId)
            throw new common_1.HttpException('You can\'t send friend request to yourself', common_1.HttpStatus.BAD_REQUEST);
        if (await this.userservice.checkFriendship(req.user.id, req.body.friendId))
            throw new common_1.HttpException('You are already friends', common_1.HttpStatus.BAD_REQUEST);
        const friendrequest = await this.userservice.sendFriendRequest(req.user.id, req.body.friendId);
        this.usergtw.server.to(req.body.friendId).emit('friendRequest', friendrequest);
        return friendrequest;
    }
    async cancelFriendRequest(body, req) {
        if (await this.userservice.checkFriendship(req.user.id, req.body.friendId))
            throw new common_1.HttpException('You are already friends', common_1.HttpStatus.BAD_REQUEST);
        const friendrequest = await this.userservice.cancelFriendRequest(req.user.id, req.body.friendId);
        return friendrequest;
    }
    async acceptFrienRequest(body, req) {
        const friendrequest = await this.userservice.acceptFriendRequest(req.user.id, req.body.friendId);
        return { friendrequest };
    }
    async rejectFrienRequest(body, req) {
        const friendrequest = await this.userservice.rejectFriendRequest(req.user.id, req.body.friendId);
        return friendrequest;
    }
    async unfriend(body, req) {
        console.log('unfriend', req.body.friendId, req.user.id);
        const friendrequest = await this.userservice.unfriend(req.user.id, req.body.friendId);
        return friendrequest;
    }
    async uploadFile(file, req) {
        return file;
    }
    async blockUser(body, req) {
        const user = await this.userservice.blockUser(req.user.id, req.body.friendId);
        return user;
    }
    async unblockUser(body, req) {
        const user = await this.userservice.unblockUser(req.user.id, req.body.friendId);
        return user;
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "home", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('getUser'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('userSettings'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "userSettings", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('sendFriendRequest'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "sendFriendRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('cancelFriendRequest'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "cancelFriendRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('acc'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "acceptFrienRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('rejecte'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "rejectFrienRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('unfriend'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "unfriend", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar', {
        limits: {
            fileSize: 1024 * 1024,
        },
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, avatar, cb) => {
                const Name = req.user.id;
                if ((0, path_1.extname)(avatar.originalname) !== '.png' && (0, path_1.extname)(avatar.originalname) !== '.jpg' && (0, path_1.extname)(avatar.originalname) !== '.jpeg' && (0, path_1.extname)(avatar.originalname) !== '.gif') {
                    return cb(new common_1.HttpException('Only images are allowed', common_1.HttpStatus.BAD_REQUEST), '');
                }
                return cb(null, `${Name}${(0, path_1.extname)(avatar.originalname)}`);
            }
        })
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('blockUser'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "blockUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('unblockUser'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "unblockUser", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService,
        users_service_1.UsersService,
        users_gateway_1.UsersGateway])
], UsersController);
//# sourceMappingURL=users.controller.js.map