import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class ChatController {
    private config;
    private jwt;
    private userservice;
    private chatgtw;
    private prisma;
    constructor(config: ConfigService, jwt: JwtService, userservice: ChatService, chatgtw: ChatGateway, prisma: PrismaService);
    createRoom(body: any, req: any): Promise<{
        id: string;
        name: string;
        picture: string;
        lastMessageDate: Date;
        visibility: import(".prisma/client").$Enums.Visibility;
        password: string;
        lastMessage: string;
        is_DM: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    joinRoom(body: any, req: any): Promise<string>;
    banUser(body: any, req: any): Promise<string>;
    unbanUser(body: any, req: any): Promise<string>;
    kickUser(body: any, req: any): Promise<string>;
    getAllRoom(req: any): Promise<({
        participants: {
            id: string;
            rid: string;
            uid: string;
            role: import(".prisma/client").$Enums.Role;
            isOnline: boolean;
            isMuted: boolean;
            isBanned: boolean;
            muteTime: Date;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        picture: string;
        lastMessageDate: Date;
        visibility: import(".prisma/client").$Enums.Visibility;
        password: string;
        lastMessage: string;
        is_DM: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getMessages(body: any, req: any): Promise<({
        user: {
            id: string;
            rid: string;
            uid: string;
            role: import(".prisma/client").$Enums.Role;
            isOnline: boolean;
            isMuted: boolean;
            isBanned: boolean;
            muteTime: Date;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        msg: string;
        msgTime: Date;
        userId: string;
        rid: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    leaveRoom(body: any, req: any): Promise<string>;
    deleteRoom(body: any, req: any): Promise<string>;
    changeVisibility(body: any, req: any): Promise<string>;
    changeRoomName(body: any, req: any): Promise<string>;
    muteUser(body: any, req: any): Promise<{
        id: string;
        rid: string;
        uid: string;
        role: import(".prisma/client").$Enums.Role;
        isOnline: boolean;
        isMuted: boolean;
        isBanned: boolean;
        muteTime: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    unmuteUser(body: any, req: any): Promise<string>;
    changePassword(body: any, req: any): Promise<string>;
    giveAdmin(body: any, req: any): Promise<string>;
    getMyRooms(req: any): Promise<({
        participants: {
            id: string;
            rid: string;
            uid: string;
            role: import(".prisma/client").$Enums.Role;
            isOnline: boolean;
            isMuted: boolean;
            isBanned: boolean;
            muteTime: Date;
            createdAt: Date;
            updatedAt: Date;
        }[];
        messages: {
            id: string;
            msg: string;
            msgTime: Date;
            userId: string;
            rid: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        picture: string;
        lastMessageDate: Date;
        visibility: import(".prisma/client").$Enums.Visibility;
        password: string;
        lastMessage: string;
        is_DM: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    addParticipant(body: any, req: any): Promise<string>;
    getParticipant(body: any, req: any): Promise<{
        id: string;
        userName: string;
        level: number;
        firstName: string;
        lastName: string;
        email: string;
        picture: string;
        country: string;
        phoneNumber: string;
        accessToken: string;
        password: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
