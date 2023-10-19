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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = exports.UsersService = class UsersService {
    constructor(jwt, config, prisma) {
        this.jwt = jwt;
        this.config = config;
        this.prisma = prisma;
    }
    async getUser(idu) {
        return await this.prisma.user.findUnique({
            where: {
                id: idu,
            },
        });
    }
    async createUser(req) {
        console.log(req.user);
        return await this.prisma.user.create({
            data: {
                userName: req.user.login,
                id: req.user.id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                picture: req.user.picture
            },
        });
    }
    async sendFriendRequest(userId, friendId) {
        console.log({ userId, friendId });
        const friendrequest = await this.prisma.friendShip.create({
            data: {
                userId,
                friendId,
            }
        });
        return friendrequest;
    }
    async cancelFriendRequest(userId, friendId) {
        const friendrequest = await this.prisma.friendShip.delete({
            where: {
                userId_friendId: {
                    userId,
                    friendId,
                }
            }
        });
        return friendrequest;
    }
    async acceptFriendRequest(userId, friendId) {
        const friendrequest = await this.prisma.friendShip.update({
            where: {
                userId_friendId: {
                    userId: friendId,
                    friendId: userId,
                }
            },
            data: {
                status: 'ACCEPTED'
            }
        });
        if (await this.prisma.chatRoom.findFirst({
            where: {
                AND: [
                    {
                        participants: {
                            some: {
                                uid: {
                                    in: [userId, friendId],
                                },
                            },
                        },
                    },
                    {
                        is_DM: true
                    },
                ],
            }
        })) {
            return { friendrequest };
        }
        const chatRoom = this.creatChatRoom(userId, friendId);
        return { friendrequest, chatRoom };
    }
    async creatChatRoom(userId, friendId) {
        const chatRoom = await this.prisma.chatRoom.create({
            data: {
                name: 'Chat between ' + (await this.prisma.user.findUnique({ where: { id: userId } })).firstName
                    + ' and ' + (await this.prisma.user.findUnique({ where: { id: friendId } })).firstName,
            }
        });
        const participant1 = await this.prisma.participant.create({
            data: {
                uid: userId,
                rid: chatRoom.id,
            }
        });
        const participant2 = await this.prisma.participant.create({
            data: {
                uid: friendId,
                rid: chatRoom.id,
            }
        });
        return chatRoom;
    }
    async rejectFriendRequest(userId, friendId) {
        const friendrequest = await this.prisma.friendShip.update({
            where: {
                userId_friendId: {
                    userId: friendId,
                    friendId: userId,
                }
            },
            data: {
                status: 'REJECTED'
            }
        });
    }
    async unfriend(userId, friendId) {
        const friendrequest = this.prisma.friendShip.findFirst({
            where: {
                OR: [
                    {
                        userId,
                        friendId,
                    },
                    {
                        userId: friendId,
                        friendId: userId,
                    },
                ],
            },
        });
        await this.prisma.friendShip.delete({
            where: {
                id: (await friendrequest).id,
            }
        });
    }
    async checkFriendship(userId, friendId) {
        const friendrequest = await this.prisma.friendShip.findFirst({
            where: {
                OR: [
                    {
                        userId,
                        friendId,
                    },
                    {
                        userId: friendId,
                        friendId: userId,
                    },
                ],
            },
        });
        if (friendrequest)
            return true;
        return false;
    }
    async blockUser(userId, friendId) {
        const check = await this.prisma.block.findFirst({
            where: {
                AND: [
                    {
                        uid: userId,
                    },
                    {
                        fid: friendId,
                    },
                ],
            },
        });
        if (check)
            return;
        const block = await this.prisma.block.create({
            data: {
                uid: userId,
                fid: friendId,
            }
        });
        return block;
    }
    async unblockUser(userId, friendId) {
        const check = await this.prisma.block.findFirst({
            where: {
                AND: [
                    {
                        uid: userId,
                    },
                    {
                        fid: friendId,
                    },
                ],
            },
        });
        if (!check)
            throw new common_1.UnauthorizedException('You are not allowed to do this');
        const block = await this.prisma.block.delete({
            where: {
                uid_fid: {
                    uid: userId,
                    fid: friendId,
                }
            }
        });
        return block;
    }
};
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map