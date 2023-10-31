import { OnGatewayConnection } from "@nestjs/websockets";
import { UsersService } from "./users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Server } from "socket.io";
export declare class UsersGateway implements OnGatewayConnection {
    private readonly chatService;
    private jwt;
    private config;
    private usr;
    constructor(chatService: UsersService, jwt: JwtService, config: ConfigService, usr: UsersService);
    server: Server;
    handleConnection(client: any, ...args: any[]): Promise<void>;
    private parseCookies;
}
