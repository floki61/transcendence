import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from './game.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly gameService;
    private jwt;
    private config;
    constructor(gameService: GameService, jwt: JwtService, config: ConfigService);
    private server;
    private gameStarted;
    private connectedClients;
    Quee: Map<string, Socket>;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    private parseCookies;
    private determineGameResult;
    private moveBall;
    handleUpdatePaddle(client: Socket, event: any): Promise<void>;
    private checkStartGame;
    private broadcastGameData;
    quee(id: any): Promise<void>;
    Botgame(id: any): Promise<void>;
}
