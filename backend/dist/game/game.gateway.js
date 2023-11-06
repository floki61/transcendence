"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const game_service_1 = require("./game.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
let GameGateway = exports.GameGateway = class GameGateway {
    constructor(gameService, jwt, config, prisma) {
        this.gameService = gameService;
        this.jwt = jwt;
        this.config = config;
        this.prisma = prisma;
        this.gameStarted = false;
        this.connectedClients = new Map();
        this.Queue = new Map();
        this.matchmakingQueue = [];
        setInterval(() => this.matchPlayers(), 1000);
    }
    async handleConnection(client) {
        let cookie;
        let payload;
        if (client.request.headers.cookie) {
            cookie = await this.parseCookies(client.request.headers.cookie);
            payload = await this.jwt.verifyAsync(cookie, {
                secret: this.config.get('secret')
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
    async handleDisconnect(client) {
        let cookie;
        let payload;
        if (client.request.headers.cookie) {
            cookie = await this.parseCookies(client.request.headers.cookie);
            payload = await this.jwt.verifyAsync(cookie, {
                secret: this.config.get('secret')
            });
            if (payload.id) {
                console.log(`Client disconnected: ${payload.id} Socket: ${client.id}`);
                if (this.Queue.get(payload.id) && this.Queue.get(payload.id).status === 'playing' && this.Queue.get(payload.id).gameType === 'Live') {
                    var player1;
                    var player2;
                    if (this.Queue.get(payload.id).leader) {
                        player1 = payload.id;
                        player2 = this.Queue.get(payload.id).playWith;
                        if (this.Queue.get(player2))
                            this.Queue.get(player2).Socket.emit('gameResult', 'Winner');
                        this.Queue.get(player1).status = 'finished';
                        this.Queue.get(player2).status = 'finished';
                    }
                    else {
                        player1 = this.Queue.get(payload.id).playWith;
                        player2 = payload.id;
                        if (this.Queue.get(player1))
                            this.Queue.get(player1).Socket.emit('gameResult', 'Winner');
                        this.Queue.get(player2).status = 'finished';
                        this.Queue.get(player1).status = 'finished';
                    }
                    await this.prisma.game.update({
                        where: {
                            id: this.Queue.get(payload.id).gameId,
                        },
                        data: {
                            player1Score: this.Queue.get(payload.id).gameData.score.left,
                            player2Score: this.Queue.get(payload.id).gameData.score.right,
                            winnerId: player2,
                            loserId: player1,
                        }
                    });
                }
                if (this.Queue.has(payload.id))
                    this.Queue.delete(payload.id);
                if (this.matchmakingQueue.includes(payload.id))
                    this.matchmakingQueue.splice(this.matchmakingQueue.indexOf(payload.id), 1);
                this.connectedClients.delete(payload.id);
            }
        }
    }
    parseCookies(cookieHeader) {
        const cookies = {};
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
    async determineGameResult(id, id2) {
        if (this.Queue.get(id).gameType === 'Bot') {
            if (this.Queue.get(id)) {
                if (this.Queue.get(id).gameData.score.left === 5)
                    this.Queue.get(id).Socket.emit('gameResult', 'Winner');
                else
                    this.Queue.get(id).Socket.emit('gameResult', 'Loser');
            }
        }
        else if (this.Queue.get(id).gameType === 'Live') {
            if (this.Queue.get(id).gameData.score.left === 5) {
                if (this.Queue.get(id))
                    this.Queue.get(id).Socket.emit('gameResult', 'Winner');
                if (this.Queue.get(id2))
                    this.Queue.get(id2).Socket.emit('gameResult', 'Loser');
            }
            else {
                if (this.Queue.get(id))
                    this.Queue.get(id).Socket.emit('gameResult', 'Loser');
                if (this.Queue.get(id2))
                    this.Queue.get(id2).Socket.emit('gameResult', 'Winner');
            }
        }
    }
    async moveBotBall(id) {
        if (!this.Queue.get(id))
            return;
        while (this.Queue.has(id) && this.Queue.get(id).status === 'playing') {
            let res = await this.gameService.moveBall(this.Queue.get(id).gameData);
            await this.gameService.moveBot(this.Queue.get(id).gameData);
            if (!this.Queue.has(id) || this.Queue.get(id).status !== 'playing')
                break;
            if (res === 'reset') {
                await this.gameService.resetBall(this.Queue.get(id).gameData);
                if (this.Queue.get(id).gameData.score.left === 5 || this.Queue.get(id).gameData.score.right === 5) {
                    console.log('game over');
                    if (this.Queue.get(id))
                        await this.determineGameResult(id);
                    this.Queue.get(id).status = 'finished';
                    break;
                }
            }
            this.Queue.get(id).Socket.emit('updateBall', this.Queue.get(id).gameData);
            await new Promise((resolve) => setTimeout(resolve, 1000 / 60));
        }
    }
    async moveBall(player1, player2) {
        if (!this.Queue.get(player1) || !this.Queue.get(player2))
            return;
        while (this.Queue.has(player1) && this.Queue.has(player2) && this.Queue.get(player1).status === 'playing' && this.Queue.get(player2).status === 'playing') {
            let res = await this.gameService.moveBall(this.Queue.get(player1).gameData);
            if (!this.Queue.has(player1) || !this.Queue.has(player2) || this.Queue.get(player1).status !== 'playing' || this.Queue.get(player2).status !== 'playing')
                break;
            if (res === 'reset') {
                await this.prisma.game.update({
                    where: {
                        id: this.Queue.get(player1).gameId,
                    },
                    data: {
                        player1Score: this.Queue.get(player1).gameData.score.left,
                        player2Score: this.Queue.get(player1).gameData.score.right,
                    }
                });
                await this.gameService.resetBall(this.Queue.get(player1).gameData);
                if (this.Queue.get(player1).gameData.score.left === 5 || this.Queue.get(player1).gameData.score.right === 5) {
                    await this.prisma.game.update({
                        where: {
                            id: this.Queue.get(player1).gameId,
                        },
                        data: {
                            winnerId: this.Queue.get(player1).gameData.score.left === 5 ? player1 : player2,
                            loserId: this.Queue.get(player1).gameData.score.right === 5 ? player2 : player1,
                        }
                    });
                    console.log('game over');
                    await this.determineGameResult(player1, player2);
                    this.Queue.get(player1).status = 'finished';
                    this.Queue.get(player2).status = 'finished';
                    break;
                }
            }
            if (this.Queue.get(player1) && this.Queue.get(player2) && this.Queue.get(player1).status === 'playing' && this.Queue.get(player2).status === 'playing') {
                this.Queue.get(player1).Socket.emit('updateBall', this.Queue.get(player1).gameData);
                this.Queue.get(player2).Socket.emit('updateBall', this.Queue.get(player1).gameData);
            }
            await new Promise((resolve) => setTimeout(resolve, 1000 / 60));
        }
    }
    async updateBotPaddle(client, event) {
        const id = this.getByValue(this.connectedClients, client);
        await this.gameService.updateBotPaddle(event, this.Queue.get(id).gameData, this.Queue.get(id).gameMode);
        if (this.Queue.get(id))
            this.Queue.get(id).Socket.emit('paddlesUpdate', this.Queue.get(id).gameData);
    }
    startBotGame(id) {
        console.log(id, this.Queue.get(id).status);
        if (this.Queue.get(id).status === 'waiting') {
            this.Queue.get(id).status = 'playing';
            this.connectedClients.get(id).emit('startBotGame', this.Queue.get(id).gameData);
            console.log('Bot game started');
            this.moveBotBall(id);
        }
    }
    async updatePaddle(client, event) {
        const id = this.getByValue(this.connectedClients, client);
        const targetPaddle = this.Queue.get(id).leader ? true : false;
        const leaderid = targetPaddle ? id : this.Queue.get(id).playWith;
        await this.gameService.updatePaddles(event, this.Queue.get(leaderid).gameData, targetPaddle, this.Queue.get(leaderid).gameMode);
        this.Queue.get(id).Socket.emit('paddlesUpdate', this.Queue.get(leaderid).gameData);
        this.Queue.get(this.Queue.get(id).playWith).Socket.emit('paddlesUpdate', this.Queue.get(leaderid).gameData);
    }
    startLiveGame(player1, player2) {
        this.Queue.get(player1).status = 'playing';
        this.Queue.get(player1).playWith = player2;
        this.Queue.get(player1).leader = true;
        this.Queue.get(player2).status = 'playing';
        this.Queue.get(player2).playWith = player1;
        console.log('Live game started');
        this.Queue.get(player1).Socket.emit('startGame', this.Queue.get(player1).gameData);
        this.Queue.get(player2).Socket.emit('startGame', this.Queue.get(player1).gameData);
        this.moveBall(player1, player2);
    }
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
            });
            this.Queue.get(player1).gameId = game.id;
            this.Queue.get(player2).gameId = game.id;
            this.startLiveGame(player1, player2);
        }
    }
    broadcastGameData() {
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
    async game(client, data) {
        console.log(data);
        const d = {
            Socket: client,
            gameType: data.type,
            gameMode: data.mode,
            status: 'waiting',
            gameData: this.gameService.getGameData(),
            playWith: '',
            leader: false,
            gameId: '',
        };
        const id = this.getByValue(this.connectedClients, client);
        this.Queue.set(id, d);
        if (data.type === 'Bot')
            this.startBotGame(id);
        else if (data.type === 'Live')
            this.matchmakingQueue.push(id);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('paddleBotUpdate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "updateBotPaddle", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('paddlesUpdate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "updatePaddle", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('gameMode'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "game", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'game', cors: true, origin: ['http://localhost:3000/game'] }),
    __metadata("design:paramtypes", [game_service_1.GameService,
        jwt_1.JwtService,
        config_1.ConfigService,
        prisma_service_1.PrismaService])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map