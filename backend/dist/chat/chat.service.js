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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const argon = require("argon2");
const event_emitter_1 = require("@nestjs/event-emitter");
let ChatService = exports.ChatService = class ChatService {
    constructor(prisma, jwt, eventEmitter) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.eventEmitter = eventEmitter;
        this.map = new Map();
    }
    async create(createChatDto, client) {
        var message = { ...createChatDto };
        console.log(createChatDto);
        const participant = await this.prisma.participant.findUnique({
            where: {
                uid_rid: {
                    uid: createChatDto.uid,
                    rid: createChatDto.rid,
                },
            },
        });
        if (!participant) {
            throw new common_1.NotFoundException('User not found in chat room');
        }
        if (participant.isBanned === true || participant.isMuted === true) {
            throw new common_1.UnauthorizedException('User cannot send message');
        }
        var mssg;
        try {
            mssg = await this.prisma.message.create({
                data: {
                    userId: participant.id,
                    msg: createChatDto.msg,
                    rid: createChatDto.rid,
                },
            });
        }
        catch (error) {
            client.emit('errorEvent', {
                message: 'An error occurred',
                error: error.message,
            });
        }
        await this.prisma.chatRoom.update({
            where: {
                id: createChatDto.rid,
            },
            data: {
                updatedAt: new Date(),
                lastMessage: createChatDto.msg,
                lastMessageDate: new Date(),
            },
        });
        message = { ...message, msgTime: mssg.msgTime };
        console.log(message);
        return message;
    }
    async joinRoom(payload) {
        const room = await this.prisma.chatRoom.findUnique({
            where: {
                id: payload.rid,
            },
        });
        if (!room) {
            throw new common_1.NotFoundException('Chat room not found');
        }
        if (room.is_DM === true)
            throw new common_1.NotFoundException('Chat room is DM');
        if (room.visibility === 'PROTECTED') {
            if (!payload.password) {
                throw new common_1.NotFoundException('Password is required in protected room');
            }
            const isMatch = await argon.verify(room.password, payload.password);
            if (!isMatch) {
                throw new common_1.UnauthorizedException('Wrong password');
            }
        }
        if (room.visibility === 'PRIVATE') {
            throw new common_1.UnauthorizedException('Private room');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.uid,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const participant = await this.prisma.participant.create({
            data: {
                uid: payload.uid,
                rid: payload.rid,
                role: 'USER',
            },
        });
        this.eventEmitter.emit('joinRoom', { uid: payload.uid, rid: payload.rid });
        return 'Joined room';
    }
    async kickUser(payload) {
        const room = await this.prisma.chatRoom.findUnique({
            where: {
                id: payload.rid,
            },
            include: {
                participants: true,
            },
        });
        if (!room) {
            throw new common_1.NotFoundException('Chat room not found');
        }
        const participant = await this.prisma.participant.findUnique({
            where: {
                uid_rid: {
                    uid: payload.id,
                    rid: payload.rid,
                },
            },
        });
        if (!participant) {
            throw new common_1.NotFoundException('User not found in chat room');
        }
        if (participant.role === 'OWNER') {
            throw new common_1.UnauthorizedException('Cannot kick owner');
        }
        await this.prisma.participant.delete({
            where: {
                uid_rid: {
                    uid: payload.id,
                    rid: payload.rid,
                },
            },
        });
        console.log(await this.map.size);
        if (this.map.get(payload.id)) {
            this.map.get(payload.id).leave(payload.rid);
        }
        this.eventEmitter.emit('kickUser', payload);
        return 'Kicked user';
    }
    async createRoom(payload) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.id,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        var room = await this.prisma.chatRoom.create({
            data: {
                name: payload.name,
                is_DM: false,
            },
        });
        const participant = await this.prisma.participant.create({
            data: {
                uid: payload.id,
                rid: room.id,
                role: 'OWNER',
            },
        });
        if (payload.visibility === 'PROTECTED') {
            if (!payload.password) {
                throw new common_1.NotFoundException('Password is required in protected room');
            }
            const hash = await argon.hash(payload.password);
            room = await this.prisma.chatRoom.update({
                where: {
                    id: room.id,
                },
                data: {
                    visibility: 'PROTECTED',
                    password: hash,
                },
            });
        }
        else if (payload.visibility === 'PRIVATE') {
            room = await this.prisma.chatRoom.update({
                where: {
                    id: room.id,
                },
                data: {
                    visibility: 'PRIVATE',
                },
            });
        }
        delete room.password;
        return room;
    }
    async banUser(payload) {
        const participant = await this.prisma.participant.findUnique({
            where: {
                uid_rid: {
                    uid: payload.uid,
                    rid: payload.rid,
                },
            },
        });
        if (!participant) {
            throw new common_1.NotFoundException('User not found in chat room');
        }
        if (participant.role === 'OWNER') {
            throw new common_1.UnauthorizedException('Cannot ban owner');
        }
        await this.prisma.participant.update({
            where: {
                uid_rid: {
                    uid: payload.uid,
                    rid: payload.rid,
                },
            },
            data: {
                isBanned: true,
            },
        });
        this.eventEmitter.emit('banUser', payload);
        return 'Banned user';
    }
    async unbanUser(payload) {
        const participant = await this.prisma.participant.findUnique({
            where: {
                uid_rid: {
                    uid: payload.uid,
                    rid: payload.rid,
                },
            },
        });
        if (!participant) {
            throw new common_1.NotFoundException('User not found in chat room');
        }
        await this.prisma.participant.update({
            where: {
                uid_rid: {
                    uid: payload.uid,
                    rid: payload.rid,
                },
            },
            data: {
                isBanned: false,
            },
        });
        this.eventEmitter.emit('unbanUser', payload);
        return 'Unbanned user';
    }
    async leaveRoom(payload) {
        const room = await this.prisma.chatRoom.findUnique({
            where: {
                id: payload.rid,
            },
            include: {
                participants: true,
            },
        });
        if (!room) {
            throw new common_1.NotFoundException('Chat room not found');
        }
        const participant = await this.prisma.participant.findUnique({
            where: {
                uid_rid: {
                    uid: payload.uid,
                    rid: payload.rid,
                },
            },
        });
        if (!participant) {
            throw new common_1.NotFoundException('User not found in chat room');
        }
        await this.prisma.participant.delete({
            where: {
                uid_rid: {
                    uid: payload.uid,
                    rid: payload.rid,
                },
            },
        });
        this.eventEmitter.emit('leaveRoom', payload);
        return 'Left room';
    }
    async deleteRoom(payload) {
        const room = await this.prisma.chatRoom.findUnique({
            where: {
                id: payload.rid,
            },
            include: {
                participants: true,
            },
        });
        if (!room) {
            throw new common_1.NotFoundException('Chat room not found');
        }
        if (room.participants.length > 1) {
            throw new common_1.UnauthorizedException('Cannot delete room with more than 1 participant');
        }
        for (var participant of room.participants) {
            await this.prisma.participant.delete({
                where: {
                    uid_rid: {
                        uid: participant.uid,
                        rid: payload.rid,
                    },
                },
            });
        }
        await this.prisma.chatRoom.delete({
            where: {
                id: payload.rid,
            },
        });
        return 'Deleted room';
    }
    async muteUser(payload) {
        let getTime = await this.formatDate(payload.duration);
        let participant = await this.prisma.participant.findUnique({
            where: {
                uid_rid: {
                    uid: payload.uid,
                    rid: payload.rid,
                },
            },
        });
        if (!participant) {
            throw new common_1.NotFoundException('User not found in chat room');
        }
        if (participant.role === 'OWNER') {
            throw new common_1.UnauthorizedException('Cannot mute owner');
        }
        participant = await this.prisma.participant.update({
            where: {
                uid_rid: {
                    uid: payload.uid,
                    rid: payload.rid,
                },
            },
            data: {
                isMuted: true,
                muteTime: getTime,
            },
        });
        return participant;
    }
    async formatDate(duration) {
        let cuurent_date = new Date();
        if (duration === '2min')
            cuurent_date.setMinutes(cuurent_date.getMinutes() + 2);
        else if (duration === '5min')
            cuurent_date.setMinutes(cuurent_date.getMinutes() + 5);
        else if (duration === '10min')
            cuurent_date.setMinutes(cuurent_date.getMinutes() + 10);
        return cuurent_date;
    }
    async unmuteUser(payload) {
        const participant = await this.prisma.participant.findUnique({
            where: {
                uid_rid: {
                    uid: payload.uid,
                    rid: payload.rid,
                },
            },
        });
        if (!participant) {
            throw new common_1.NotFoundException('User not found in chat room');
        }
        await this.prisma.participant.update({
            where: {
                uid_rid: {
                    uid: payload.uid,
                    rid: payload.rid,
                },
            },
            data: {
                isMuted: false,
                muteTime: null,
            },
        });
        return 'Unmuted user';
    }
    async getAllRoom(id) {
        const room = await this.prisma.chatRoom.findMany({
            where: {
                is_DM: false,
                OR: [
                    {
                        AND: [
                            {
                                participants: {
                                    some: {
                                        uid: id,
                                        isBanned: false,
                                    },
                                },
                            },
                            {
                                visibility: 'PRIVATE',
                            },
                        ],
                    },
                    {
                        NOT: {
                            visibility: 'PRIVATE',
                        },
                    },
                ],
            },
            include: {
                participants: true,
            },
        });
        return room;
    }
    async getMyRooms(payload) {
        const rooms = await this.prisma.chatRoom.findMany({
            where: {
                participants: {
                    some: {
                        uid: payload.id,
                        isBanned: false,
                    },
                },
                is_DM: true,
            },
            include: {
                messages: true,
                participants: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
        for (var room of rooms) {
            if (room.messages.length > 0) {
                room.lastMessage = room.messages[room.messages.length - 1].msg;
                room.lastMessageDate = room.messages[room.messages.length - 1].msgTime;
                delete room.messages;
            }
        }
        return rooms;
    }
    async getUniqueMyRooms(payload) {
        const room = await this.prisma.chatRoom.findMany({
            where: {
                participants: {
                    some: {
                        uid: payload.id,
                        isBanned: false,
                    },
                },
            },
        });
        if (!room) {
            throw new common_1.NotFoundException('Chat room not found');
        }
        return room;
    }
    async getMessages(payload) {
        const message = await this.prisma.message.findMany({
            where: {
                rid: payload.rid,
            },
            include: {
                user: true,
            },
        });
        return message;
    }
    async changeVisibility(payload) {
        const room = await this.prisma.chatRoom.findUnique({
            where: {
                id: payload.rid,
            },
        });
        if (!room) {
            throw new common_1.NotFoundException('Chat room not found');
        }
        if (room.visibility === 'PROTECTED') {
            if (!payload.password) {
                throw new common_1.NotFoundException('Password is required in protected room');
            }
            const isMatch = await argon.verify(room.password, payload.password);
            if (!isMatch) {
                throw new common_1.UnauthorizedException('Wrong password');
            }
        }
        if (payload.visibility === 'PROTECTED') {
            if (!payload.password) {
                throw new common_1.NotFoundException('Password is required in protected room');
            }
            const hash = await argon.hash(payload.password);
            await this.prisma.chatRoom.update({
                where: {
                    id: payload.rid,
                },
                data: {
                    visibility: 'PROTECTED',
                    password: hash,
                },
            });
        }
        else {
            await this.prisma.chatRoom.update({
                where: {
                    id: payload.rid,
                },
                data: {
                    visibility: payload.visibility,
                },
            });
        }
        return 'Changed visibility';
    }
    async changeRoomName(payload) {
        const room = await this.prisma.chatRoom.findUnique({
            where: {
                id: payload.rid,
            },
        });
        if (!room) {
            throw new common_1.NotFoundException('Chat room not found');
        }
        await this.prisma.chatRoom.update({
            where: {
                id: payload.rid,
            },
            data: {
                name: payload.name,
            },
        });
        return 'Changed room name';
    }
    async changePassword(payload) {
        const room = await this.prisma.chatRoom.findUnique({
            where: {
                id: payload.rid,
            },
        });
        if (!room) {
            throw new common_1.NotFoundException('Chat room not found');
        }
        if (room.visibility !== 'PROTECTED') {
            throw new common_1.NotFoundException('Room is not protected');
        }
        if (!payload.password) {
            throw new common_1.NotFoundException('Password is required in protected room');
        }
        const hash = await argon.hash(payload.password);
        await this.prisma.chatRoom.update({
            where: {
                id: payload.rid,
            },
            data: {
                password: hash,
            },
        });
        return 'Changed password';
    }
    async giveAdmin(payload) {
        const room = await this.prisma.chatRoom.findUnique({
            where: {
                id: payload.rid,
            },
        });
        if (!room) {
            throw new common_1.NotFoundException('Chat room not found');
        }
        const participant = await this.prisma.participant.findUnique({
            where: {
                uid_rid: {
                    uid: payload.uid,
                    rid: payload.rid,
                },
            },
        });
        if (!participant) {
            throw new common_1.NotFoundException('User not found in chat room');
        }
        if (participant.role === 'OWNER') {
            throw new common_1.UnauthorizedException('Cannot give admin to owner');
        }
        if (room.is_DM === true) {
            throw new common_1.UnauthorizedException('Cannot give admin to DM');
        }
        await this.prisma.participant.update({
            where: {
                uid_rid: {
                    uid: payload.uid,
                    rid: payload.rid,
                },
            },
            data: {
                role: 'ADMIN',
            },
        });
        return 'Gave admin';
    }
    async getUserPicture(uid) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return await user.picture;
    }
    async addParticipant(payload) {
        const room = await this.prisma.chatRoom.findUnique({
            where: {
                id: payload.rid,
            },
        });
        if (!room) {
            throw new common_1.NotFoundException('Chat room not found');
        }
        for (let uid of payload.uids) {
            const participant = await this.prisma.participant.findUnique({
                where: {
                    uid_rid: {
                        uid: uid,
                        rid: payload.rid,
                    },
                },
            });
            if (participant) {
                throw new common_1.UnauthorizedException('User already in chat room');
            }
            let newParticipant = await this.prisma.participant.create({
                data: {
                    uid: uid,
                    rid: payload.rid,
                    role: 'USER',
                },
            });
        }
        return 'Added participant';
    }
};
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        event_emitter_1.EventEmitter2])
], ChatService);
//# sourceMappingURL=chat.service.js.map