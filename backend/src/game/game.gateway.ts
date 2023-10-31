import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';

let gameMode = 'live';

@WebSocketGateway({ namespace: 'game', cors: true, origin: ['http://localhost:3000/game']})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly gameService: GameService,
        private jwt: JwtService,
        private config: ConfigService) {}
    @WebSocketServer()
    private server: Server;
    private gameStarted = false;
    private connectedClients: Map<string, Socket> = new Map<string, Socket>();
    Quee: Map<string, Socket>;

    
    async handleConnection(client: Socket) {
        let cookie: string;
        let payload: any;
        if (client.request.headers.cookie) {
			cookie = await this.parseCookies(client.request.headers.cookie);
			payload = await this.jwt.verifyAsync(
				cookie,
				{
					secret: this.config.get('secret')
				});
			if (payload.id) {
                console.log(`Client connected: ${payload.id} Socket: ${client.id}`);
                if(this.connectedClients.has(payload.id))
                    client.disconnect();
                this.connectedClients.set(payload.id, client);
			}
		}
		else {
			client.disconnect();
		}
        this.checkStartGame();
    }
    
    async handleDisconnect(client: Socket) {
        let cookie: string;
		let payload: any;
		if (client.request.headers.cookie) {
			cookie = await this.parseCookies(client.request.headers.cookie);
			payload = await this.jwt.verifyAsync(
				cookie,
				{
					secret: this.config.get('secret')
				}
				);
				if (payload.id) {
                    console.log(`Client disconnected: ${payload.id} Socket: ${client.id}`);
                    this.connectedClients.delete(payload.id);
				}
		}
        this.checkStartGame();
    }

    private parseCookies(cookieHeader: string | undefined): string {
		const cookies: Record<string, string> = {};
		if (cookieHeader) {
			cookieHeader.split(';').forEach((cookie) => {
				const parts = cookie.split('=');
				const name = parts.shift()?.trim();
				let value = decodeURI(parts.join('='));
				if (value.startsWith('"') && value.endsWith('"')) {
					value = value.slice(1, -1);
				}
				if (name) {
					cookies[name] = value;
				}
			});
		}
		return cookies['access_token'];
	}

    private determineGameResult() {
        if (gameMode === 'Bot') {
            if(this.gameService.gameData.score.left === 5)
                this.connectedClients.get(Array.from(this.connectedClients.keys())[0]).emit('gameResult', 'Winner');
            else
                this.connectedClients.get(Array.from(this.connectedClients.keys())[0]).emit('gameResult', 'Loser');
        }
        else {
            const clientIds = Array.from(this.connectedClients.keys());
            if (this.gameService.gameData.score.left === 5) {
                this.connectedClients.get(clientIds[0]).emit('gameResult', 'Winner');
                this.connectedClients.get(clientIds[1]).emit('gameResult', 'Loser');
            } else if (this.gameService.gameData.score.right === 5) {
                this.connectedClients.get(clientIds[0]).emit('gameResult', 'Loser');
                this.connectedClients.get(clientIds[1]).emit('gameResult', 'Winner');
            }
        }
    }
    
    private async moveBall() {
        while(this.gameStarted) {
            const data = await this.gameService.moveBall();
            if(gameMode === 'Bot')
                await this.gameService.moveBot();
            if(data === 'reset') {
                const data = await this.gameService.resetGame();
                // this.connectedClients.forEach((connectedClient) => {
                    // connectedClient.emit('paddlesUpdate', data);
                    // connectedClient.emit('score', this.gameService.gameData.score);
                // });
                if(this.gameService.gameData.score.left === 5 || this.gameService.gameData.score.right === 5) {
                    this.determineGameResult();
                    this.gameService.resetScore();
                    this.gameStarted = false;
                    break;
                }
            }
            this.connectedClients.forEach((connectedClient) => {
              connectedClient.emit('updateBall', this.gameService.gameData);
            });
            await new Promise((resolve) => setTimeout(resolve, 1000 / 60));
        }
    }


    @SubscribeMessage('paddlesUpdate')
    async handleUpdatePaddle(client: Socket, event) {
        const [clientId1, clientId2] = Array.from(this.connectedClients.values()).map((client) => client.id);
        const targetPaddle = client.id === clientId1 ? 'leftPaddle' : 'rightPaddle';
        const gameData = await this.gameService.updatePaddle(event, targetPaddle);

        this.connectedClients.forEach((connectedClient) => {
            connectedClient.emit('paddlesUpdate', gameData);
        });
    }

    private checkStartGame() {
        if(gameMode === 'Bot' && this.connectedClients.size === 1 && !this.gameStarted)
            this.gameStarted = false;
        if(gameMode === 'Bot' && !this.gameStarted) {
            this.gameStarted = true;
            this.connectedClients.forEach((connectedClient) => {
                connectedClient.emit('startBotGame', this.gameService.gameData);
            });
            this.moveBall();
        }
        if (this.connectedClients.size === 2 && !this.gameStarted) {
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

    @OnEvent('quee')
    async quee(id: any) {
        const client = this.connectedClients.get(id);
        if (!client)
            return;
        this.Quee.set(id, client);
    }

    @OnEvent('Botgame')
    async Botgame(id: any) {
        const client = this.connectedClients.get(id);
        if (!client)
            return;
        // here you can lance the game with bot
        
    }
}

