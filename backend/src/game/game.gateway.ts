import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';



@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly gameService: GameService) {}
    @WebSocketServer()
    private server: Server;
    private gameStarted = false;
    private connectedClients: Map<string, Socket> = new Map<string, Socket>();
    
    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
        this.connectedClients.set(client.id, client);
        this.checkStartGame();
    }
    
    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
        this.connectedClients.delete(client.id);
        this.checkStartGame();
    }

    private determineGameResult() {
        const clientIds = Array.from(this.connectedClients.keys());
        if (this.gameService.score.left === 5) {
            this.connectedClients.get(clientIds[0]).emit('gameResult', 'YOU WIN');
            this.connectedClients.get(clientIds[1]).emit('gameResult', 'YOU LOSE');
        } else if (this.gameService.score.right === 5) {
            this.connectedClients.get(clientIds[0]).emit('gameResult', 'YOU LOSE');
            this.connectedClients.get(clientIds[1]).emit('gameResult', 'YOU WIN');
        }
    }
    
    private async moveBall() {
        while(this.gameStarted) {
            const data = await this.gameService.moveBall();
            if(data === 'reset') {
                const data = await this.gameService.resetGame();
                this.connectedClients.forEach((connectedClient) => {
                    connectedClient.emit('paddlesUpdate', data);
                    connectedClient.emit('score', this.gameService.score);
                });
                if(this.gameService.score.left === 5 || this.gameService.score.right === 5) {
                    this.determineGameResult();
                    this.gameService.resetScore();
                    this.gameStarted = false;
                    break;
                }
            }
            this.connectedClients.forEach((connectedClient) => {
              connectedClient.emit('updateBall', data);
            });
            await new Promise((resolve) => setTimeout(resolve, 1000 / 60));
        }
    }


    @SubscribeMessage('paddlesUpdate')
    async handleUpdatePaddle(client: Socket, event) {
        const [clientId1, clientId2] = Array.from(this.connectedClients.keys());
        const targetPaddle = client.id === clientId1 ? 'leftPaddle' : 'rightPaddle';
        const gameData = await this.gameService.updatePaddle(event, targetPaddle);

        this.connectedClients.forEach((connectedClient) => {
            connectedClient.emit('paddlesUpdate', gameData);
        });
    }

    private checkStartGame() {
        if(this.connectedClients.size < 2 && this.gameStarted) {
            this.gameStarted = false;
        }
        if (this.connectedClients.size === 2) {
            this.gameStarted = true;
            this.broadcastGameData();
            this.moveBall();
        }
    }

    private broadcastGameData() {
        this.connectedClients.forEach((connectedClient) => {
            connectedClient.emit('startGame', this.gameService.gameData);
        });
    }
}

