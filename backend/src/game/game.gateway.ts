import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({ namespace: 'game', cors: true, origin: ['http://localhost:3000/game'] })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly gameService: GameService,
        private jwt: JwtService,
        private config: ConfigService,
        private prisma: PrismaService) {
        setInterval(() => this.matchPlayers(), 1000);
    }

    @WebSocketServer()
    server: Server;
    private gameStarted = false;
    private connectedClients: Map<string, Socket> = new Map<string, Socket>();
    // gameService.Queue: Map<string, {Socket: Socket, gameType: string, gameMode: string, status: string, gameData: any, playWith: string, leader: boolean, gameId: string}> = new Map<string, {Socket: Socket, gameType: string,gameMode: string, status: string, gameData: any, playWith: string, leader: boolean, gameId: string}>();
    private matchmakingQueue: string[] = [];

    async handleConnection(client: Socket) {
        let cookie: string;
        let payload: any;
        if (client.request.headers.cookie) {
            cookie = await this.parseCookies(client.request.headers.cookie);
            payload = await this.jwt.verifyAsync(
                cookie,
                {
                    secret: this.config.get('JWT_SECRET_KEY')
                });
            if (payload.id) {
                console.log(`Client connected: ${payload.id} Socket: ${client.id}`);
                if (this.connectedClients.has(payload.id))
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
                    secret: this.config.get('JWT_SECRET_KEY')
                }
            );
            if (payload.id) {
                console.log(`Client disconnected: ${payload.id} Socket: ${client.id}`);
                if (this.gameService.Queue.get(payload.id) && this.gameService.Queue.get(payload.id).status === 'playing' && this.gameService.Queue.get(payload.id).gameType === 'Live') {
                    var player1;
                    var player2;
                    if (this.gameService.Queue.get(payload.id).leader) {
                        player1 = payload.id;
                        player2 = this.gameService.Queue.get(payload.id).playWith;
                        if (this.gameService.Queue.get(player2))
                            this.gameService.Queue.get(player2).Socket.emit('gameResult', 'Winner');
                        this.gameService.Queue.get(player1).status = 'finished';
                        this.gameService.Queue.get(player2).status = 'finished';
                    }
                    else {
                        player1 = this.gameService.Queue.get(payload.id).playWith;
                        player2 = payload.id;
                        if (this.gameService.Queue.get(player1))
                            this.gameService.Queue.get(player1).Socket.emit('gameResult', 'Winner');
                        this.gameService.Queue.get(player2).status = 'finished';
                        this.gameService.Queue.get(player1).status = 'finished';
                    }
                    await this.prisma.game.update({
                        where:
                        {
                            id: this.gameService.Queue.get(payload.id).gameId,
                        },
                        data: {
                            player1Score: this.gameService.Queue.get(payload.id).gameData.score.left,
                            player2Score: this.gameService.Queue.get(payload.id).gameData.score.right,
                            winnerId: player2,
                            loserId: player1,
                        }
                    });
                }
                if (this.gameService.Queue.has(payload.id))
                    this.gameService.Queue.delete(payload.id);
                if (this.matchmakingQueue.includes(payload.id))
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
        if (this.gameService.Queue.get(id).gameType === 'Bot') {
            if (this.gameService.Queue.get(id)) {
                if (this.gameService.Queue.get(id).gameData.score.left === 5)
                    this.gameService.Queue.get(id).Socket.emit('gameResult', 'Winner');
                else
                    this.gameService.Queue.get(id).Socket.emit('gameResult', 'Loser');
            }
        }
        else if (this.gameService.Queue.get(id).gameType === 'Live') {
            if (this.gameService.Queue.get(id).gameData.score.left === 5) {
                if (this.gameService.Queue.get(id))
                    this.gameService.Queue.get(id).Socket.emit('gameResult', 'Winner');
                if (this.gameService.Queue.get(id2))
                    this.gameService.Queue.get(id2).Socket.emit('gameResult', 'Loser');
            }
            else {
                if (this.gameService.Queue.get(id))
                    this.gameService.Queue.get(id).Socket.emit('gameResult', 'Loser');
                if (this.gameService.Queue.get(id2))
                    this.gameService.Queue.get(id2).Socket.emit('gameResult', 'Winner');
            }
        }
    }

    private async moveBotBall(id) {
        if (!this.gameService.Queue.get(id))
            return;
        while (this.gameService.Queue.has(id) && this.gameService.Queue.get(id).status === 'playing') {
            let res = await this.gameService.moveBall(this.gameService.Queue.get(id).gameData);
            await this.gameService.moveBot(this.gameService.Queue.get(id).gameData);
            if (!this.gameService.Queue.has(id) || this.gameService.Queue.get(id).status !== 'playing')
                break;
            if (res === 'reset') {
                await this.gameService.resetBall(this.gameService.Queue.get(id).gameData);
                if (this.gameService.Queue.get(id).gameData.score.left === 5 || this.gameService.Queue.get(id).gameData.score.right === 5) {
                    console.log('game over');
                    if (this.gameService.Queue.get(id))
                        await this.determineGameResult(id);
                    this.gameService.Queue.get(id).status = 'finished';
                    break;
                }
            }
            this.gameService.Queue.get(id).Socket.emit('updateBall', this.gameService.Queue.get(id).gameData);
            await new Promise((resolve) => setTimeout(resolve, 1000 / 60));
        }
    }
    private async moveBall(player1, player2) {
        if (!this.gameService.Queue.get(player1) || !this.gameService.Queue.get(player2))
            return;
        while (this.gameService.Queue.has(player1) && this.gameService.Queue.has(player2) && this.gameService.Queue.get(player1).status === 'playing' && this.gameService.Queue.get(player2).status === 'playing') {
            let res = await this.gameService.moveBall(this.gameService.Queue.get(player1).gameData);
            if (!this.gameService.Queue.has(player1) || !this.gameService.Queue.has(player2) || this.gameService.Queue.get(player1).status !== 'playing' || this.gameService.Queue.get(player2).status !== 'playing')
                break;
            if (res === 'reset') {
                await this.prisma.game.update({
                    where:
                    {
                        id: this.gameService.Queue.get(player1).gameId,
                    },
                    data: {
                        player1Score: this.gameService.Queue.get(player1).gameData.score.left,
                        player2Score: this.gameService.Queue.get(player1).gameData.score.right,
                    }
                });
                await this.gameService.resetBall(this.gameService.Queue.get(player1).gameData);
                if (this.gameService.Queue.get(player1).gameData.score.left === 5 || this.gameService.Queue.get(player1).gameData.score.right === 5) {
                    const game = await this.prisma.game.update({
                        where:
                        {
                            id: this.gameService.Queue.get(player1).gameId,
                        },
                        data: {
                            winnerId: this.gameService.Queue.get(player1).gameData.score.left === 5 ? player1 : player2,
                            loserId: this.gameService.Queue.get(player1).gameData.score.left === 5 ? player2 : player1,
                            player1Id: this.gameService.Queue.get(player1).gameData.score.left === 5 ? player1 : player2,
                            player2Id: this.gameService.Queue.get(player1).gameData.score.left === 5 ? player2 : player1,
                            player1Score: this.gameService.Queue.get(player1).gameData.score.left === 5 ? 5 : this.gameService.Queue.get(player1).gameData.score.right,
                            player2Score: this.gameService.Queue.get(player1).gameData.score.right === 5 ? this.gameService.Queue.get(player1).gameData.score.left : 5,
                        }
                    });
                    const winner = await this.prisma.user.update({
                        where: {
                            id: game.winnerId,
                        },
                        data: {
                            level: {
                                increment: 30,
                            }
                        }
                    });
                    console.log('game over');
                    await this.determineGameResult(player1, player2);
                    this.gameService.Queue.get(player1).status = 'finished';
                    this.gameService.Queue.get(player2).status = 'finished';
                    break;
                }
            }
            if (this.gameService.Queue.get(player1) && this.gameService.Queue.get(player2) && this.gameService.Queue.get(player1).status === 'playing' && this.gameService.Queue.get(player2).status === 'playing') {
                this.gameService.Queue.get(player1).Socket.emit('updateBall', this.gameService.Queue.get(player1).gameData);
                this.gameService.Queue.get(player2).Socket.emit('updateBall', this.gameService.Queue.get(player1).gameData);
            }
            await new Promise((resolve) => setTimeout(resolve, 1000 / 60));
        }
    }

    @SubscribeMessage('paddleBotUpdate')
    async updateBotPaddle(client: Socket, event) {
        const id = this.getByValue(this.connectedClients, client);
        await this.gameService.updateBotPaddle(event, this.gameService.Queue.get(id).gameData, this.gameService.Queue.get(id).gameMode);
        if (this.gameService.Queue.get(id))
            this.gameService.Queue.get(id).Socket.emit('paddlesUpdate', this.gameService.Queue.get(id).gameData);
    }

    private startBotGame(id) {
        console.log(id, this.gameService.Queue.get(id).status);
        if (this.gameService.Queue.get(id).status === 'waiting') {
            this.gameService.Queue.get(id).status = 'playing';
            this.connectedClients.get(id).emit('startBotGame', this.gameService.Queue.get(id).gameData);
            console.log('Bot game started');
            this.moveBotBall(id);
        }
    }

    @SubscribeMessage('paddlesUpdate')
    async updatePaddle(client: Socket, event) {
        const id = this.getByValue(this.connectedClients, client);
        const targetPaddle = this.gameService.Queue.get(id).leader ? true : false;
        const leaderid = targetPaddle ? id : this.gameService.Queue.get(id).playWith;
        await this.gameService.updatePaddles(event, this.gameService.Queue.get(leaderid).gameData, targetPaddle, this.gameService.Queue.get(leaderid).gameMode);
        this.gameService.Queue.get(id).Socket.emit('paddlesUpdate', this.gameService.Queue.get(leaderid).gameData);
        this.gameService.Queue.get(this.gameService.Queue.get(id).playWith).Socket.emit('paddlesUpdate', this.gameService.Queue.get(leaderid).gameData);

    }

    private startLiveGame(player1: string, player2: string) {
        this.gameService.Queue.get(player1).status = 'playing';
        this.gameService.Queue.get(player1).playWith = player2;
        this.gameService.Queue.get(player1).leader = true;
        this.gameService.Queue.get(player2).status = 'playing';
        this.gameService.Queue.get(player2).playWith = player1;
        console.log('Live game started');
        this.gameService.Queue.get(player1).Socket.emit('startGame', this.gameService.Queue.get(player1).gameData);
        this.gameService.Queue.get(player2).Socket.emit('startGame', this.gameService.Queue.get(player1).gameData);
        this.moveBall(player1, player2);
    }

    // private startFriendGame(player1: string, player2: string) {
    //     this.gameService.Queue.get(player1).status = 'playing';
    //     this.gameService.Queue.get(player1).playWith = player2;
    //     this.gameService.Queue.get(player1).leader = true;
    //     this.gameService.Queue.get(player2).status = 'playing';
    //     this.gameService.Queue.get(player2).playWith = player1;
    //     console.log('Friend game started');
    //     this.gameService.Queue.get(player1).Socket.emit('startGame', this.gameService.Queue.get(player1).gameData);
    //     this.gameService.Queue.get(player2).Socket.emit('startGame', this.gameService.Queue.get(player1).gameData);
    //     this.moveBall(player1, player2);
    // }

    async matchPlayers() {
        while (this.matchmakingQueue.length >= 2) {
            const player1 = this.matchmakingQueue.shift();
            const player2 = this.matchmakingQueue.shift();
            console.log('Matching players', player1, player2);
            var game = await this.prisma.game.create({
                data: {
                    player1Id: player1,
                    player2Id: player2,
                    player1Score: 0,
                    player2Score: 0,
                }
            })
            this.gameService.Queue.get(player1).gameId = game.id;
            this.gameService.Queue.get(player2).gameId = game.id;
            this.startLiveGame(player1, player2);
        }
    }

    getByValue(map, searchValue) {
        for (let [key, value] of map.entries()) {
            if (value === searchValue)
                return key;
        }
    }

    // private sendPlayRequest(playerId: string, friendId: string) {
    //     const friendSocket = this.gameService.Queue.get(friendId)?.Socket;
    //     if (friendSocket) {
    //       friendSocket.emit('playRequest', { playerId });
    //     }
    // }


    @SubscribeMessage('gameMode')
    async game(client: Socket, data) {
        console.log(data);
        const gameData = {
            Socket: client,
            gameType: data.type,
            gameMode: data.mode,
            status: 'waiting',
            gameData: this.gameService.getGameData(),
            playWith: '',
            leader: false,
            gameId: '',
        }
        const playerId = this.getByValue(this.connectedClients, client);
        this.gameService.Queue.set(playerId, gameData);
        if (data.type === 'Bot')
            this.startBotGame(playerId);
        else if (data.type === 'Live')
            this.matchmakingQueue.push(playerId);
        // else if(data.type === 'Friend') {
        //     if(this.gameService.Queue.has(data.friendId)) {
        //         const friendData = this.gameService.Queue.get(data.friendId);
        //         if (friendData.gameType === 'Friend' && friendData.playWith === playerId) {
        //             this.startFriendGame(playerId, data.friendId);
        //         }
        //     }
        //     else {
        //         // this.sendPlayRequest(playerId, data.friendId);
        //     }
        // }
    }
}
