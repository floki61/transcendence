import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    private jwt;
    private config;
    server: Server;
    map: Map<any, any>;
    constructor(chatService: ChatService, jwt: JwtService, config: ConfigService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    private parseCookies;
    create(createChatDto: CreateChatDto, client: Socket): Promise<{
        id: string;
        msg: string;
        rid: string;
    }>;
    joinRoom(payload: any): Promise<void>;
    kickUser(payload: any): void;
    banUser(payload: any, client: Socket): void;
    unbanUser(payload: any, client: Socket): void;
    leaveRoom(payload: any, client: Socket): void;
}
