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
    Quee: Map<string, {
        Socket: Socket;
        gameMode: string;
        status: string;
        gameData: any;
    }>;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    private parseCookies;
    determineGameResult(id: any): Promise<void>;
    private moveBotBall;
    updateBotPaddle(client: Socket, event: any): Promise<void>;
    private checkStartGame;
    private startBotGame;
    private startLiveGame;
    private broadcastGameData;
    getByValue(map: any, searchValue: any): any;
    gameMode(client: Socket, mode: string): Promise<void>;
}
