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
let gameMode = "";
let GameGateway = exports.GameGateway = class GameGateway {
    constructor(gameService, jwt, config) {
        this.gameService = gameService;
        this.jwt = jwt;
        this.config = config;
        this.gameStarted = false;
        this.connectedClients = new Map();
        this.Quee = new Map();
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
        this.checkStartGame(client);
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
                this.connectedClients.delete(payload.id);
                if (this.Quee.has(payload.id))
                    this.Quee.delete(payload.id);
            }
        }
        this.checkStartGame(client);
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
    determineGameResult(id) {
        if (this.Quee.get(id).gameMode === 'Bot') {
            if (this.Quee.get(id).gameData.score.left === 5)
                this.Quee.get(id).Socket.emit('gameResult', 'Winner');
            else
                this.Quee.get(id).Socket.emit('gameResult', 'Loser');
        }
    }
    async moveBotBall(id) {
        if (!this.Quee.get(id)) {
            console.log('no game data');
            return;
        }
        else
            console.log('here', this.Quee.get(id).Socket.id);
        while (this.Quee.has(id) && this.Quee.get(id).status === 'playing') {
            let res = await this.gameService.moveBall(this.Quee.get(id).gameData);
            await this.gameService.moveBot(this.Quee.get(id).gameData);
            if (!this.Quee.has(id) || this.Quee.get(id).status !== 'playing')
                break;
            if (res === 'reset') {
                res = "";
                await this.gameService.resetBall(this.Quee.get(id).gameData);
                if (this.Quee.get(id).gameData.score.left === 5 || this.Quee.get(id).gameData.score.right === 5) {
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
    async updateBotPaddle(client, event) {
        const id = this.getByValue(this.connectedClients, client);
        await this.gameService.updateBotPaddle(event, this.Quee.get(id).gameData);
        this.Quee.get(id).Socket.emit('paddlesUpdate', this.Quee.get(id).gameData);
    }
    checkStartGame(client) {
    }
    startBotGame(id) {
        if (this.Quee.get(id).status === 'waiting') {
            this.Quee.get(id).status = 'playing';
            this.connectedClients.get(id).emit('startBotGame', this.Quee.get(id).gameData);
            console.log('Bot game started');
            this.moveBotBall(id);
        }
    }
    startLiveGame(client) {
        this.gameStarted = true;
        client.emit('startGame', this.gameService.gameData);
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
    async gameMode(client, mode) {
        console.log(mode);
        const d = {
            Socket: client,
            gameMode: mode,
            status: 'waiting',
            gameData: this.gameService.getGameData(),
        };
        const id = this.getByValue(this.connectedClients, client);
        this.Quee.set(id, d);
        this.startBotGame(id);
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
    (0, websockets_1.SubscribeMessage)('gameMode'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "gameMode", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'game', cors: true, origin: ['http://localhost:3000/game'] }),
    __metadata("design:paramtypes", [game_service_1.GameService,
        jwt_1.JwtService,
        config_1.ConfigService])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map