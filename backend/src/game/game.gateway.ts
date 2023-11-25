import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { FortyTwoGuard } from 'src/auth/tools/Guards';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({ namespace: 'game', cors: true, origin: ['http://localhost:3000/game'] })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly gameService: GameService,
        private jwt: JwtService,
        private config: ConfigService,
        private prisma: PrismaService,
        private event: EventEmitter2,
        private userService: UsersService) {
        setInterval(() => this.matchPlayers(), 1000);
    }

    @WebSocketServer()
    server: Server;
    private connectedClients: Map<string, Socket> = new Map<string, Socket>();
    private matchmakingQueue: string[] = [];

    async handleConnection(client: Socket) {
        let cookie: string;
        let payload: any;
        if (client.request.headers.cookie) {
            cookie = await this.parseCookies(client.request.headers.cookie);
            try {
                payload = await this.jwt.verifyAsync(
                    cookie,
                    {
                        secret: this.config.get('JWT_SECRET_KEY')
                    });
            }
            catch (e) {
                client.emit('redirect', this.config.get('LOGIN_URL'));
                client.disconnect();
                return;
            }
            if (!payload || !payload.id) {
                client.emit('redirect', this.config.get('LOGIN_URL'));
                client.disconnect();
                return;
            }
            if (payload && payload.id) {
                console.log(`Client connected: ${payload.id} Socket: ${client.id}`);
                if (this.connectedClients.has(payload.id)) {
                    console.log('Client already connected: ' + payload.id);
                    client.emit('alreadyConnected');
                }
                else {
                    this.connectedClients.set(payload.id, client);
                    await this.prisma.user.update({
                        where: {
                            id: payload.id,
                        },
                        data: {
                            status: 'INGAME',
                        }
                    });
                    this.event.emit('StatusEvent', { id: payload.id, status: 'INGAME', socket: client.id });
                }
            }
        }
        else {
            client.emit('redirect', this.config.get('LOGIN_URL'));
            client.disconnect();
            return;
        }
    }

    async handleDisconnect(client: Socket) {
        let cookie: string;
        let payload: any;
        if (!this.connectedClients.has(this.getByValue(this.connectedClients, client)))
            return;
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
                if (this.gameService.Queue.get(payload.id) && this.gameService.Queue.get(payload.id).gameType === 'Bot') {
                    this.gameService.Queue.get(payload.id).status = 'finished';
                }
                else if (this.gameService.Queue.get(payload.id) && this.gameService.Queue.get(payload.id).status === 'playing') {
                    var player1;
                    var player2;
                    if (this.gameService.Queue.get(payload.id).leader) {
                        player1 = payload.id;
                        player2 = this.gameService.Queue.get(payload.id).playWith;
                        if (this.gameService.Queue.get(player2))
                            this.gameService.Queue.get(player2).Socket.emit('gameResult', 'You won!');
                        this.gameService.Queue.get(player1).status = 'finished';
                        this.gameService.Queue.get(player2).status = 'finished';
                    }
                    else {
                        player1 = this.gameService.Queue.get(payload.id).playWith;
                        player2 = payload.id;
                        if (this.gameService.Queue.get(player1))
                            this.gameService.Queue.get(player1).Socket.emit('gameResult', 'You won!');
                        this.gameService.Queue.get(player2).status = 'finished';
                        this.gameService.Queue.get(player1).status = 'finished';
                    }
                    await this.prisma.game.update({
                        where:
                        {
                            id: this.gameService.Queue.get(payload.id).gameId,
                        },
                        data: {
                            player1Score: 5,
                            player2Score: 0,
                            winnerId: this.gameService.Queue.get(payload.id).playWith,
                            loserId: payload.id,
                        }
                    });
                }
                if (this.gameService.Queue.has(payload.id))
                    this.gameService.Queue.delete(payload.id);
                if (this.matchmakingQueue.includes(payload.id))
                    this.matchmakingQueue.splice(this.matchmakingQueue.indexOf(payload.id), 1);
                if (this.connectedClients.has(payload.id)) {
                    this.connectedClients.delete(payload.id);
                    await this.prisma.user.update({
                        where: {
                            id: payload.id,
                        },
                        data: {
                            status: 'ONLINE',
                        },
                    });
                    this.event.emit('StatusEvent', { id: payload.id, status: 'ONLINE', socket: client.id });
                    this.gameService.endgameForStatus(payload.id);
                }
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
                    this.gameService.Queue.get(id).Socket.emit('gameResult', 'You won');
                else
                    this.gameService.Queue.get(id).Socket.emit('gameResult', 'You lost');
            }
        }
        else {
            if (this.gameService.Queue.get(id).gameData.score.left === 5) {
                if (this.gameService.Queue.get(id))
                    this.gameService.Queue.get(id).Socket.emit('gameResult', 'You won');
                if (this.gameService.Queue.get(id2))
                    this.gameService.Queue.get(id2).Socket.emit('gameResult', 'You lost');
            }
            else {
                if (this.gameService.Queue.get(id))
                    this.gameService.Queue.get(id).Socket.emit('gameResult', 'You lost');
                if (this.gameService.Queue.get(id2))
                    this.gameService.Queue.get(id2).Socket.emit('gameResult', 'You won');
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
                    // if (this.gameService.checkAchievements(
                    //     await this.prisma.achivement.findMany({
                    //         where: {
                    //             uid: id,
                    //         }
                    //     }), 'Bot')) {
                    //     await this.prisma.achivement.create({
                    //         data: {
                    //             uid: id,
                    //             achivementName: 'Bot',
                    //             alreadyAchieved: true,
                    //         }
                    //     });
                    // }
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
                            // player1Id: this.gameService.Queue.get(player1).gameData.score.left === 5 ? player1 : player2,
                            // player2Id: this.gameService.Queue.get(player1).gameData.score.left === 5 ? player2 : player1,
                            // player1Score: this.gameService.Queue.get(player1).gameData.score.left === 5 ? 5 : this.gameService.Queue.get(player1).gameData.score.right,
                            // player2Score: this.gameService.Queue.get(player1).gameData.score.right === 5 ? this.gameService.Queue.get(player1).gameData.score.left : 5,
                        }
                    });
                    await this.prisma.game.update({
                        where:
                        {
                            id: this.gameService.Queue.get(player1).gameId,
                        },
                        data: {
                            player1Id: this.gameService.Queue.get(player1).gameData.score.left === 5 ? player1 : player2,
                            player2Id: this.gameService.Queue.get(player1).gameData.score.left === 5 ? player2 : player1,
                            player1Score: (player2 === game.winnerId) ? game.player2Score : game.player1Score,
                            player2Score: (player2 === game.winnerId) ? game.player1Score : game.player2Score,
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
                    this.gameService.handleAchievements(game);

                    console.log('game over');
                    await this.determineGameResult(player1, player2);
                    this.gameService.Queue.get(player1).status = 'finished';
                    this.gameService.Queue.get(player2).status = 'finished';
                    break;
                }
            }
            if (this.gameService.Queue.get(player1).gameMode === 'hidden') {
                if (this.gameService.Queue.get(player1).gameData.ball.x < this.gameService.Queue.get(player1).gameData.canvasWidth / 4 ||
                    this.gameService.Queue.get(player1).gameData.ball.x > this.gameService.Queue.get(player1).gameData.canvasWidth - (this.gameService.Queue.get(player1).gameData.canvasWidth / 4)) {
                    this.gameService.Queue.get(player1).gameData.ball.pos = 0;
                }
                else
                    this.gameService.Queue.get(player1).gameData.ball.pos = 1;
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
        console.log('Bot paddle updated');
    }

    private async startBotGame(id) {
        console.log(id, this.gameService.Queue.get(id).status);
        if (this.gameService.Queue.get(id).status === 'waiting') {
            this.gameService.Queue.get(id).status = 'playing';
            const userData = {
                player1: {
                    img: await this.userService.getPictureWithId(id),
                    name: await this.userService.getUserNameWithId(id),
                    level: await this.userService.getLevelWithId(id),
                },
                player2: {
                    img: '/boot.png',
                    name: 'Bot',
                    level: '999',
                },
                mode: 'Bot',
            }
            this.connectedClients.get(id).emit('startBotGame', { gameData: this.gameService.Queue.get(id).gameData, userData: userData, pos: 'left' });
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

    private async startLiveGame(player1: string, player2: string) {
        this.gameService.Queue.get(player1).status = 'playing';
        this.gameService.Queue.get(player1).playWith = player2;
        this.gameService.Queue.get(player1).leader = true;
        this.gameService.Queue.get(player2).status = 'playing';
        this.gameService.Queue.get(player2).playWith = player1;
        const userData = {
            player1: {
                img: await this.userService.getPictureWithId(player1),
                name: await this.userService.getUserNameWithId(player1),
                level: await this.userService.getLevelWithId(player1),
            },
            player2: {
                img: await this.userService.getPictureWithId(player2),
                name: await this.userService.getUserNameWithId(player2),
                level: await this.userService.getLevelWithId(player2),
            },
            mode: this.gameService.Queue.get(player1).gameMode,
        }
        console.log('Live game started');
        this.gameService.Queue.get(player1).Socket.emit('startGame', { gameData: this.gameService.Queue.get(player1).gameData, userData: userData, pos: 'left' });
        this.gameService.Queue.get(player2).Socket.emit('startGame', { gameData: this.gameService.Queue.get(player1).gameData, userData: userData, pos: 'right' });
        this.moveBall(player1, player2);
    }

    async matchPlayers() {
        while (this.matchmakingQueue.length >= 2) {
            let player1 = null;
            let player2 = null;
            for (let i = 0; i < this.matchmakingQueue.length - 1; i++) {
                for (let j = i + 1; j < this.matchmakingQueue.length; j++) {
                    const mode1 = this.gameService.Queue.get(this.matchmakingQueue[i]).gameMode;
                    const mode2 = this.gameService.Queue.get(this.matchmakingQueue[j]).gameMode;

                    if (mode1 === mode2) {
                        player1 = this.matchmakingQueue[i];
                        player2 = this.matchmakingQueue[j];
                        break;
                    }
                }
                if (player1 && player2)
                    break;
            }
            if (!player1 || !player2) {
                console.log('No matching players found.');
                break;
            }
            this.matchmakingQueue = this.matchmakingQueue.filter(playerId => playerId !== player1 && playerId !== player2);
            console.log(this.matchmakingQueue);
            console.log('Matching players', player1, player2);
            console.log(this.gameService.Queue.get(player1).gameMode);
            var game = await this.prisma.game.create({
                data: {
                    mode: this.gameService.Queue.get(player1).gameMode,
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

    @SubscribeMessage('gameMode')
    async game(client: Socket, data) {
        if (!this.connectedClients.has(this.getByValue(this.connectedClients, client)))
            return;
        const gameData = {
            Socket: client,
            gameType: data.type,
            gameMode: data.mode,
            status: 'waiting',
            gameData: this.gameService.getGameData(),
            playWith: data.friendId,
            leader: false,
            gameId: '',
        }
        const playerId = this.getByValue(this.connectedClients, client);
        this.gameService.Queue.set(playerId, gameData);
        if (data.type === 'Bot')
            this.startBotGame(playerId);
        else if (data.type === 'Live') {
            const userData = {
                player1: {
                    img: await this.userService.getPictureWithId(playerId),
                    name: await this.userService.getUserNameWithId(playerId),
                    level: await this.userService.getLevelWithId(playerId),
                },
                mode: gameData.gameMode,
            }
            client.emit('userData', userData);
            this.matchmakingQueue.push(playerId);
        }
        else if (data.type === 'Friend' && data.friendId !== playerId) {
            if (this.gameService.Queue.has(data.friendId)) {
                const friendData = this.gameService.Queue.get(data.friendId);
                if (friendData.gameType === 'Friend' && friendData.status === 'waiting' && friendData.playWith === playerId) {
                    var game = await this.prisma.game.create({
                        data: {
                            mode: this.gameService.Queue.get(playerId).gameMode,
                            player1Id: playerId,
                            player2Id: gameData.playWith,
                            player1Score: 0,
                            player2Score: 0,
                        }
                    })
                    this.gameService.Queue.get(playerId).gameId = game.id;
                    this.gameService.Queue.get(gameData.playWith).gameId = game.id;
                    this.startLiveGame(playerId, data.friendId);
                }
            }
        }
    }
}

