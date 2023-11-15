import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    private jwt;
    private config;
    private event;
    server: Server;
    map: Map<any, any>;
    constructor(chatService: ChatService, jwt: JwtService, config: ConfigService, event: EventEmitter2);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    private parseCookies;
    create(createChatDto: CreateChatDto, client: Socket): Promise<{
        uid: string;
        msg: string;
        rid: string;
        msgTime: Date;
    }>;
    joinRoom(payload: any): Promise<void>;
    kickUser(payload: any): void;
    banUser(payload: any, client: Socket): void;
    unbanUser(payload: any, client: Socket): void;
    leaveRoom(payload: any, client: Socket): void;
    updateStatus(payload: any): Promise<void>;
    updateChatRooms(payload: any): Promise<({
        messages: {
            id: string;
            msg: string;
            msgTime: Date;
            userId: string;
            rid: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
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
}
