import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
export declare class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private server;
    private gameStarted;
    private gameData;
    private connectedClients;
    mapValue(value: number, start1: number, stop1: number, start2: number, stop2: number): number;
    map: (n: number, start1: number, stop1: number, start2: number, stop2: number, withinBounds?: boolean) => any;
    private moveBall;
    private handlePaddleUpdate;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleUpdatePaddle(client: Socket, event: any): void;
    private checkStartGame;
    private updateGameData;
    private broadcastGameData;
}
