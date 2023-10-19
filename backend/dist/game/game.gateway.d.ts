import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from './game.service';
export declare class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly gameService;
    constructor(gameService: GameService);
    private server;
    private gameStarted;
    private connectedClients;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    private determineGameResult;
    private moveBall;
    handleUpdatePaddle(client: Socket, event: any): Promise<void>;
    private checkStartGame;
    private broadcastGameData;
}
