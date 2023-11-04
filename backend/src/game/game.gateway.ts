import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';

let gameMode = "";

@WebSocketGateway({ namespace: 'game', cors: true, origin: ['http://localhost:3000/game']})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly gameService: GameService,
        private jwt: JwtService,
        private config: ConfigService,
        private prisma: PrismaService) {
            setInterval(() => this.matchPlayers(), 10000);
        }

    @WebSocketServer()
    private server: Server;
    private gameStarted = false;
    private connectedClients: Map<string, Socket> = new Map<string, Socket>();
    Quee: Map<string, {Socket: Socket, gameMode: string, status: string, gameData: any, playWith: string, leader: boolean, gameId: string}> = new Map<string, {Socket: Socket, gameMode: string, status: string, gameData: any, playWith: string, leader: boolean, gameId: string}>();
    private matchmakingQueue: string[] = [];

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
                    if (this.Quee.get(payload.id) && this.Quee.get(payload.id).status === 'playing' && this.Quee.get(payload.id).gameMode === 'Live') {
                        var player1;
                        var player2;
                        if (this.Quee.get(payload.id).leader) {
                            player1 = payload.id;
                            player2 = this.Quee.get(payload.id).playWith;
                            if (this.Quee.get(player2))
                                this.Quee.get(player2).Socket.emit('gameResult', 'Winner');
                            this.Quee.get(player1).status = 'finished';
                            this.Quee.get(player2).status = 'finished';
                        }
                        else {
                            player1 = this.Quee.get(payload.id).playWith;
                            player2 = payload.id;
                            if (this.Quee.get(player1))
                                this.Quee.get(player1).Socket.emit('gameResult', 'Winner');
                            this.Quee.get(player2).status = 'finished';
                            this.Quee.get(player1).status = 'finished';
                        }
                        await this.prisma.game.update({
                            where:
                            {
                                id: this.Quee.get(payload.id).gameId,
                            },
                            data: {
                                player1Score: this.Quee.get(payload.id).gameData.score.left,
                                player2Score: this.Quee.get(payload.id).gameData.score.right,
                                winnerId: player2,
                                loserId: player1,
                            }
                        });
                    }
                    if(this.Quee.has(payload.id))
                        this.Quee.delete(payload.id);
                    if(this.matchmakingQueue.includes(payload.id))
                        this.matchmakingQueue.splice(this.matchmakingQueue.indexOf(payload.id), 1);
                    this.connectedClients.delete(payload.id);
				}
		}
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

    async determineGameResult(id, id2?) {
        if (this.Quee.get(id).gameMode === 'Bot') {
            if(this.Quee.get(id).gameData.score.left === 5)
                this.Quee.get(id).Socket.emit('gameResult', 'Winner');
            else
                this.Quee.get(id).Socket.emit('gameResult', 'Loser');
        }
        else if (this.Quee.get(id).gameMode === 'Live') {
            if(this.Quee.get(id).gameData.score.left === 5) {
                this.Quee.get(id).Socket.emit('gameResult', 'Winner');
                this.Quee.get(id2).Socket.emit('gameResult', 'Loser');
            }
            else {
                this.Quee.get(id).Socket.emit('gameResult', 'Loser');
                this.Quee.get(id2).Socket.emit('gameResult', 'Winner');
            }
        }
    }
    
    private async moveBotBall(id) {
        if(!this.Quee.get(id)) {
            console.log('no Live game data');
            return ;
        }
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
                    await this.determineGameResult(id);
                    this.Quee.get(id).status = 'waiting';
                    break;
                }
            }
            this.Quee.get(id).Socket.emit('updateBall', this.Quee.get(id).gameData);
            await new Promise((resolve) => setTimeout(resolve, 1000 / 60));
        }
    }
    private async moveBall(player1, player2) {
        if(!this.Quee.get(player1) || !this.Quee.get(player2)) {
            console.log('no Live game data');
            return ;
        }
        while(this.Quee.has(player1) && this.Quee.has(player2) && this.Quee.get(player1).status === 'playing' && this.Quee.get(player2).status === 'playing') {
            let res = await this.gameService.moveBall(this.Quee.get(player1).gameData);
            if (!this.Quee.has(player1) || !this.Quee.has(player2) || this.Quee.get(player1).status !== 'playing' || this.Quee.get(player2).status !== 'playing')
                break ;
            if(res === 'reset') {
                await this.prisma.game.update({
                    where:
                    {
                        id: this.Quee.get(player1).gameId,
                    },
                    data: {
                        player1Score: this.Quee.get(player1).gameData.score.left,
                        player2Score: this.Quee.get(player1).gameData.score.right,
                    }
                });
                await this.gameService.resetBall(this.Quee.get(player1).gameData);
                if(this.Quee.get(player1).gameData.score.left === 5 || this.Quee.get(player1).gameData.score.right === 5) {
                    if (this.Quee.get(player1).gameData.score.left === 5) {
                        await this.prisma.game.update({
                            where:
                            {
                                id: this.Quee.get(player1).gameId,
                            },
                            data: {
                                winnerId: player1,
                                loserId: player2,
                            }
                        });
                    }
                    else
                    {
                        await this.prisma.game.update({
                            where:
                            {
                                id: this.Quee.get(player1).gameId,
                            },
                            data: {
                                winnerId: player2,
                                loserId: player1,
                            }
                        });
                    }
                    console.log('game over');
                    await this.determineGameResult(player1, player2);
                    this.Quee.get(player1).status = 'waiting';
                    this.Quee.get(player2).status = 'waiting';
                    break;
                }
            }
            this.Quee.get(player1).Socket.emit('updateBall', this.Quee.get(player1).gameData);
            this.Quee.get(player2).Socket.emit('updateBall', this.Quee.get(player1).gameData);
            await new Promise((resolve) => setTimeout(resolve, 1000 / 60));
        }
    }

    @SubscribeMessage('paddleBotUpdate')
    async updateBotPaddle(client: Socket, event) {
        const id = this.getByValue(this.connectedClients, client);
        await this.gameService.updateBotPaddle(event, this.Quee.get(id).gameData);
        this.Quee.get(id).Socket.emit('paddlesUpdate', this.Quee.get(id).gameData);
    }

    private startBotGame(id) {
        console.log(id, this.Quee.get(id).status);
        if(this.Quee.get(id).status === 'waiting') {
            this.Quee.get(id).status = 'playing';
            this.connectedClients.get(id).emit('startBotGame', this.Quee.get(id).gameData);
            console.log('Bot game started');
            this.moveBotBall(id);
        }
    }

    @SubscribeMessage('paddlesUpdate')
    async updatePaddle(client: Socket, event) {
        const id = this.getByValue(this.connectedClients, client);
        const targetPaddle = this.Quee.get(id).leader ? true : false;
        const leaderid = targetPaddle ? id : this.Quee.get(id).playWith;
        await this.gameService.updatePaddles(event, this.Quee.get(leaderid).gameData, targetPaddle);
        this.Quee.get(id).Socket.emit('paddlesUpdate', this.Quee.get(leaderid).gameData);
        this.Quee.get(this.Quee.get(id).playWith).Socket.emit('paddlesUpdate', this.Quee.get(leaderid).gameData);

    }
    // private startLiveGame(id) {
    //     while(this.Quee.get(id).status === 'waiting') {
    //         for(var i of this.Quee) {
    //             if(i[0] != id && i[1].status === 'waiting' && i[1].gameMode === 'Live') {
    //                 this.Quee.get(id).status = 'playing';
    //                 this.Quee.get(i[0]).status = 'playing';
    //                 // this.Quee.get(id).Socket.emit('startGame', this.Quee.get(id).gameData);
    //                 // this.Quee.get(i[0]).Socket.emit('startGame', this.Quee.get(id).gameData);
    //                 console.log(id, this.Quee.get(id).status);
    //                 // this.moveBall(id, i[0]);
    //             }
    //         }
    //     }
    // }
    private startLiveGame(player1: string, player2: string) {
        this.Quee.get(player1).status = 'playing';
        this.Quee.get(player1).playWith = player2;
        this.Quee.get(player1).leader = true;
        this.Quee.get(player2).status = 'playing';
        this.Quee.get(player2).playWith = player1;
        console.log('Live game started');
        this.Quee.get(player1).Socket.emit('startGame', this.Quee.get(player1).gameData);
        this.Quee.get(player2).Socket.emit('startGame', this.Quee.get(player2).gameData);
        this.moveBall(player1, player2);
    }
    
    async matchPlayers() {
        while (this.matchmakingQueue.length >= 2) {
            const player1 = this.matchmakingQueue.shift();
            const player2 = this.matchmakingQueue.shift();
            console.log('Matching players', player1, player2);
            this.startLiveGame(player1, player2);
            var game = await this.prisma.game.create({
                data: {
                    player1Id: player1,
                    player2Id: player2,
                    player1Score: 0,
                    player2Score: 0,
                }
            })
            this.Quee.get(player1).gameId = game.id;
            this.Quee.get(player2).gameId = game.id;
        }
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
        const d = {
            Socket: client,
            gameMode: mode,
            status: 'waiting',
            gameData: this.gameService.getGameData(),
            playWith: '',
            leader: false,
            gameId: '',
        }
        const id = this.getByValue(this.connectedClients, client);
        this.Quee.set(id, d);
        if(mode === 'Bot')
            this.startBotGame(id);
        else if(mode === 'Live')
            this.matchmakingQueue.push(id);
        // this.startLiveGame(id);
    }
}