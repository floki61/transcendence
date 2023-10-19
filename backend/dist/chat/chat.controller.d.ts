import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
export declare class ChatController {
    private config;
    private jwt;
    private userservice;
    private chatgtw;
    constructor(config: ConfigService, jwt: JwtService, userservice: ChatService, chatgtw: ChatGateway);
    createRoom(body: any, req: any): Promise<{
        id: string;
        name: string;
        visibility: import(".prisma/client").$Enums.Visibility;
        password: string;
        is_DM: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    joinRoom(body: any, req: any): Promise<string>;
    banUser(body: any, req: any): Promise<string>;
    unbanUser(body: any, req: any): Promise<string>;
    kickUser(body: any, req: any): Promise<string>;
    getAllRoom(body: any, req: any): Promise<({
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
    getMessages(body: any, req: any): Promise<({
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
    deleteRoom(body: any, req: any): Promise<string>;
    changeVisibility(body: any, req: any): Promise<string>;
    changeRoomName(body: any, req: any): Promise<string>;
    muteUser(body: any, req: any): Promise<string>;
    unmuteUser(body: any, req: any): Promise<string>;
    changePassword(body: any, req: any): Promise<string>;
    giveAdmin(body: any, req: any): Promise<string>;
}
