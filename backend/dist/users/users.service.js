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
    async checkIfnameExists(username) {
        const user = await this.prisma.user.findUnique({
            where: {
                userName: username,
            },
        });
        console.log(user);
        return user ? true : false;
    }
    async updateUser(req, data) {
        if (data.userName)
            this.updateUserName(req, data.userName);
        if (data.phoneNumber)
            this.updateUserPhoneNumber(req, data);
        if (data.country)
            this.updateUserCountry(req, data);
        await this.prisma.user.update({
            where: {
                id: req.user.id,
            },
            data: {
                picture: data.picture,
            },
        });
    }
    async updateUserPicture(req, data) {
        return await this.prisma.user.update({
            where: {
                id: req.user.id,
            },
            data: {
                picture: data.picture,
            },
        });
    }
    async updateUserName(req, data) {
        if (await this.checkIfnameExists(data))
            return "Username already exists";
        return await this.prisma.user.update({
            where: {
                id: req.user.id,
            },
            data: {
                userName: data,
            },
        });
    }
    async updateUserPhoneNumber(req, data) {
        return await this.prisma.user.update({
            where: {
                id: req.user.id,
            },
            data: {
                phoneNumber: data.phoneNumber,
            },
        });
    }
    async updateUserCountry(req, data) {
        return await this.prisma.user.update({
            where: {
                id: req.user.id,
            },
            data: {
                country: data.country,
            },
        });
    }
    async createUser(req) {
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
    async getUserNameWithId(id) {
        if (!id)
            return null;
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (user)
            return user.userName;
        return null;
    }
    async getPictureWithId(id) {
        if (!id)
            return null;
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (user)
            return user.picture;
        return null;
    }
    async sendPlayRequest(userId, friendId) {
        console.log({ userId, friendId });
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId,
            }
        });
        return { user };
    }
    async sendFriendRequest(userId, friendId) {
        const friendrequest = await this.prisma.friendShip.create({
            data: {
                userId,
                friendId,
            }
        });
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId,
            }
        });
        console.log({ friendrequest, user });
        return { friendrequest, user };
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
                is_DM: true,
                AND: [
                    {
                        participants: {
                            some: {
                                uid: userId,
                            },
                        },
                    },
                    {
                        participants: {
                            some: {
                                uid: friendId,
                            },
                        },
                    },
                ],
            }
        })) {
            console.log("hnaa-------------------------------------");
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
        await this.prisma.friendShip.delete({
            where: {
                userId_friendId: {
                    userId: friendId,
                    friendId: userId,
                }
            },
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
        const chatroom = await this.prisma.chatRoom.findFirst({
            where: {
                is_DM: true,
                AND: [
                    {
                        participants: {
                            some: {
                                uid: userId,
                            },
                        },
                    },
                    {
                        participants: {
                            some: {
                                uid: friendId,
                            },
                        },
                    },
                ],
            }
        });
        if (chatroom) {
            await this.prisma.chatRoom.delete({
                where: {
                    id: chatroom.id,
                }
            });
        }
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
        if (!await this.checkFriendship(userId, friendId)) {
            await this.creatChatRoom(userId, friendId);
        }
        return block;
    }
    async deleteAccount(userId) {
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                status: "DELETED",
                isDeleted: true,
                picture: '',
                userName: userId,
                firstName: 'User',
                lastName: '',
            },
        });
    }
    async getFriends(userId) {
        const friendRequests = await this.prisma.friendShip.findMany({
            where: {
                OR: [
                    {
                        userId,
                        status: 'ACCEPTED',
                    },
                    {
                        friendId: userId,
                        status: 'ACCEPTED',
                    },
                ],
            },
            include: {
                user: true,
                friend: true,
            },
        });
        return { friendRequests };
    }
    async getFriendRequests(userId) {
        let friendrequest = await this.prisma.friendShip.findMany({
            where: {
                friendId: userId,
                status: 'PENDING',
            },
            include: {
                user: true,
            },
        });
        return friendrequest;
    }
    async getIfBlocked(userId, friendId) {
        const blocked = await this.prisma.block.findFirst({
            where: {
                OR: [
                    {
                        uid: userId,
                        fid: friendId,
                    },
                    {
                        uid: friendId,
                        fid: userId,
                    },
                ],
            },
        });
        if (blocked)
            return true;
        return false;
    }
    async getFriendProfile(userId, id) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            console.log("hnaa", userId);
            throw new common_1.HttpException('User not found', 404);
        }
        const friendship = await this.prisma.friendShip.findFirst({
            where: {
                OR: [
                    {
                        userId: id,
                        friendId: userId,
                    },
                    {
                        userId,
                        friendId: id,
                    }
                ]
            },
        });
        return { user, ...await this.getLevelP(user.level), isfriend: friendship ? (friendship.status === 'ACCEPTED' ? 'friend' : 'cancel') : 'notfriend', ifBlocked: await this.getIfBlocked(userId, id) };
    }
    async getFriendProfileWithUserName(userName, id) {
        const user = await this.prisma.user.findFirst({
            where: {
                userName,
            },
        });
        if (!user) {
            console.log("machi hna");
            throw new common_1.HttpException('User not found', 404);
        }
        const friendship = await this.prisma.friendShip.findFirst({
            where: {
                userId: user.id,
                friendId: id,
            },
        });
        console.log('isfriend:', friendship ? (friendship.status === 'ACCEPTED' ? 'friend' : 'cancel') : 'notfriend');
        return { user, ...await this.getLevelP(user.level), isfriend: friendship ? (friendship.status === 'ACCEPTED' ? 'friend' : 'cancel') : 'notfriend', ifBlocked: await this.getIfBlocked(user.id, id) };
    }
    async getAllUsers() {
        return await this.prisma.user.findMany();
    }
    async getLevelP(lvl) {
        let level_P = 0;
        let i = lvl;
        let index = 20;
        let barPourcentage;
        while (i >= index) {
            i -= index;
            level_P++;
            index *= 2;
        }
        if (i > 0) {
            barPourcentage = (i / index) * 100;
        }
        return { level_P, barPourcentage };
    }
    async getProfile(userId) {
        let user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        return { user, ...await this.getLevelP(user.level) };
    }
    async getStats(body) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: body.id,
            },
            include: {
                wins: true,
                loses: true,
            }
        });
        let stats = {
            MP: 0,
            W: 0,
            L: 0,
            GS: 0,
            GC: 0
        };
        const games = await this.prisma.game.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            {
                                winnerId: body.id,
                            },
                            {
                                loserId: body.id,
                            },
                        ],
                    },
                    {
                        mode: body.mode,
                    },
                ],
            },
        });
        const gamestats = await this.prisma.game.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            {
                                winnerId: body.id,
                            },
                            {
                                loserId: body.id,
                            },
                        ],
                    },
                    {
                        mode: body.mode,
                    },
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
        });
        stats.MP = games.length;
        stats.W = games.filter(game => game.winnerId === body.id).length;
        stats.L = stats.MP - stats.W;
        stats.GS = games.reduce((total, game) => total + (game.winnerId === body.id ? game.player1Score : game.player2Score), 0);
        stats.GC = games.reduce((total, game) => total + (game.winnerId === body.id ? game.player2Score : game.player1Score), 0);
        return { stats, gamestats };
    }
    async getAchievements(userId) {
        const achievements = await this.prisma.achivement.findMany({
            where: {
                uid: userId,
            },
        });
        return achievements;
    }
    async getLeaderboard(body) {
        const users = await this.prisma.user.findMany({
            orderBy: {
                level: 'desc',
            },
            include: {
                wins: true,
                loses: true,
            },
        });
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const levelInfo = await this.getLevelP(user.level);
            const games = await this.prisma.game.findMany({
                where: {
                    OR: [
                        { winnerId: user.id },
                        { loserId: user.id },
                    ],
                },
            });
            let stats = {
                MP: 0,
                W: 0,
                L: 0,
                GS: 0,
                GC: 0,
            };
            if (games.length > 0) {
                stats.MP = games.length;
                stats.W = games.filter(game => game.winnerId === user.id).length;
                stats.L = stats.MP - stats.W;
                stats.GS = games.reduce((total, game) => total + (game.winnerId === user.id ? game.player1Score : game.player2Score), 0);
                stats.GC = games.reduce((total, game) => total + (game.winnerId === user.id ? game.player2Score : game.player1Score), 0);
            }
            users[i] = { ...user, ...levelInfo, ...stats };
        }
        return users;
    }
    async getBlockedList(userId) {
        const blockedList = await this.prisma.block.findMany({
            where: {
                uid: userId,
            },
            include: {
                friend: true,
            },
        });
        console.log('eheh', blockedList);
        return blockedList;
    }
};
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map