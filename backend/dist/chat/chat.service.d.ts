import { CreateChatDto } from './dto/create-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class ChatService {
    private prisma;
    private jwt;
    private eventEmitter;
    constructor(prisma: PrismaService, jwt: JwtService, eventEmitter: EventEmitter2);
    map: Map<any, any>;
    create(createChatDto: CreateChatDto, client: Socket): Promise<{
        id: string;
        msg: string;
        rid: string;
    }>;
    joinRoom(payload: any): Promise<string>;
    kickUser(payload: any): Promise<string>;
    createRoom(payload: any): Promise<{
        id: string;
        name: string;
        visibility: import(".prisma/client").$Enums.Visibility;
        password: string;
        is_DM: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    banUser(payload: any): Promise<string>;
    unbanUser(payload: any): Promise<string>;
    leaveRoom(payload: any, client: Socket): Promise<string>;
    deleteRoom(payload: any): Promise<string>;
    muteUser(payload: any): Promise<string>;
    unmuteUser(payload: any): Promise<string>;
    getAllRoom(): Promise<({
        participants: {
            id: string;
            rid: string;
            uid: string;
            role: import(".prisma/client").$Enums.Role;
            isOnline: boolean;
            isMuted: boolean;
            isBanned: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        visibility: import(".prisma/client").$Enums.Visibility;
        password: string;
        is_DM: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getMyRooms(payload: any): Promise<({
        participants: {
            id: string;
            rid: string;
            uid: string;
            role: import(".prisma/client").$Enums.Role;
            isOnline: boolean;
            isMuted: boolean;
            isBanned: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        visibility: import(".prisma/client").$Enums.Visibility;
        password: string;
        is_DM: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getMessages(payload: any): Promise<({
        user: {
            id: string;
            rid: string;
            uid: string;
            role: import(".prisma/client").$Enums.Role;
            isOnline: boolean;
            isMuted: boolean;
            isBanned: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        msg: string;
        userId: string;
        rid: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    changeVisibility(payload: any): Promise<string>;
    changeRoomName(payload: any): Promise<string>;
    changePassword(payload: any): Promise<string>;
    giveAdmin(payload: any): Promise<string>;
}