import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';

let gameMode = "";

@WebSocketGateway({ namespace: 'game', cors: true, origin: ['http://localhost:3000/game']})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly gameService: GameService,
        private jwt: JwtService,
        private config: ConfigService) {}
    @WebSocketServer()
    private server: Server;
    private gameStarted = false;
    private connectedClients: Map<string, Socket> = new Map<string, Socket>();
    Quee: Map<string, {Socket: Socket, gameMode: string, status: string, gameData: any}> = new Map<string, {Socket: Socket, gameMode: string, status: string, gameData: any}>();

    
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
        this.checkStartGame(client);
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
                    if(this.Quee.has(payload.id))
                        this.Quee.delete(payload.id);
				}
		}
        this.checkStartGame(client);
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

    private determineGameResult(id) {
        if (this.Quee.get(id).gameMode === 'Bot') {
            if(this.Quee.get(id).gameData.score.left === 5)
                this.Quee.get(id).Socket.emit('gameResult', 'Winner');
            else
                this.Quee.get(id).Socket.emit('gameResult', 'Loser');
        }
        // else {
        //     const clientIds = Array.from(this.connectedClients.keys());
        //     if (this.gameService.gameData.score.left === 5) {
        //         this.connectedClients.get(clientIds[0]).emit('gameResult', 'Winner');
        //         this.connectedClients.get(clientIds[1]).emit('gameResult', 'Loser');
        //     } else if (this.gameService.gameData.score.right === 5) {
        //         this.connectedClients.get(clientIds[0]).emit('gameResult', 'Loser');
        //         this.connectedClients.get(clientIds[1]).emit('gameResult', 'Winner');
        //     }
        // }
    }
    
    private async moveBotBall(id) {
        if(!this.Quee.get(id)) {
            console.log('no game data');
            return ;
        }
        else
            console.log('here',this.Quee.get(id).Socket.id);
        while (this.Quee.has(id) && this.Quee.get(id).status === 'playing') {
            let res = await this.gameService.moveBall(this.Quee.get(id).gameData);
            await this.gameService.moveBot(this.Quee.get(id).gameData);
            if (!this.Quee.has(id) || this.Quee.get(id).status !== 'playing')
                break;
            if(res === 'reset') {
                res = "";
                await this.gameService.resetBall(this.Quee.get(id).gameData);
                if(this.Quee.get(id).gameData.score.left === 5 || this.Quee.get(id).gameData.score.right === 5) {
                    console.log('game over');
                    this.determineGameResult(id);
                    this.Quee.get(id).status = 'waiting';
                    break;
                }
            }
            this.Quee.get(id).Socket.emit('updateBall', this.Quee.get(id).gameData);
            await new Promise((resolve) => setTimeout(resolve, 1000 / 60));
        }
    }
    // private async moveBall(id, data?: any) {
    //     while(this.Quee.get(id).status === 'playing') {
    //         const data = await this.gameService.moveBall(data);
    //         if(gameMode === 'Bot')
    //             await this.gameService.moveBot();
    //         if(data === 'reset') {
    //             const data = await this.gameService.resetBall();
    //             // this.connectedClients.forEach((connectedClient) => {
    //                 // connectedClient.emit('paddlesUpdate', data);
    //                 // connectedClient.emit('score', this.gameService.gameData.score);
    //             // });
    //             if(this.gameService.gameData.score.left === 5 || this.gameService.gameData.score.right === 5) {
    //                 this.determineGameResult(client);
    //                 this.gameService.resetScore();
    //                 this.gameStarted = false;
    //                 break;
    //             }
    //         }
    //         if(gameMode === 'Bot')
    //             client.emit('updateBall', this.gameService.gameData);
    //         else {
    //             this.connectedClients.forEach((connectedClient) => {
    //                 connectedClient.emit('updateBall', this.gameService.gameData);
    //             });
    //         }
    //         await new Promise((resolve) => setTimeout(resolve, 1000 / 60));
    //     }
    // }


    // @SubscribeMessage('paddlesUpdate')
    // async handleUpdatePaddle(client: Socket, event) {
    //     const [clientId1, clientId2] = Array.from(this.connectedClients.values()).map((client) => client.id);
    //     const targetPaddle = client.id === clientId1 ? 'leftPaddle' : 'rightPaddle';
    //     const gameData = await this.gameService.updatePaddle(event, targetPaddle);

    //     this.connectedClients.forEach((connectedClient) => {
    //         connectedClient.emit('paddlesUpdate', gameData);
    //     });
    // }
    @SubscribeMessage('paddleBotUpdate')
    async updateBotPaddle(client: Socket, event) {
        const id = this.getByValue(this.connectedClients, client);
        await this.gameService.updateBotPaddle(event, this.Quee.get(id).gameData);
        this.Quee.get(id).Socket.emit('paddlesUpdate', this.Quee.get(id).gameData);
    }

    private checkStartGame(client: Socket) {
        // if(gameMode === 'Bot')
        // {
        //     console.log('Bot game started');
        //     this.startBotGame(client);
        // }
        // if(gameMode === 'live'){
        // }
        // if(gameMode === 'Bot' && this.connectedClients.size === 1 && !this.gameStarted)
        //     this.gameStarted = false;
        // if(gameMode === 'Bot' && !this.gameStarted) {
        //     this.gameStarted = true;
        //     this.connectedClients.forEach((connectedClient) => {
        //         connectedClient.emit('startBotGame', this.gameService.gameData);
        //     });
        //     this.moveBall();
        // }
        // if (this.connectedClients.size === 2 && !this.gameStarted) {
        //     this.gameStarted = true;
        //     this.broadcastGameData();
        //     this.moveBall();
        // }
    }
    private startBotGame(id) {
        if(this.Quee.get(id).status === 'waiting') {
            this.Quee.get(id).status = 'playing';
            this.connectedClients.get(id).emit('startBotGame', this.Quee.get(id).gameData);
            console.log('Bot game started');
            this.moveBotBall(id);
        }
    }
    private startLiveGame(client: Socket) {
        this.gameStarted = true;
        client.emit('startGame', this.gameService.gameData);
        // this.moveBall();
    }
    private broadcastGameData() {
        this.connectedClients.forEach((connectedClient) => {
            connectedClient.emit('startGame', this.gameService.gameData);
        });
    }

    getByValue(map, searchValue) {
        for (let [key, value] of map.entries()) {
          if (value === searchValue)
            return key;
        }
      }      

    @SubscribeMessage('gameMode')
    async gameMode(client: Socket, mode: string) {
        console.log(mode);
        const d = {
            Socket: client,
            gameMode: mode,
            status: 'waiting',
            gameData: this.gameService.getGameData(),
        }
        const id = this.getByValue(this.connectedClients, client);
        this.Quee.set(id, d);
        this.startBotGame(id);
    }
}