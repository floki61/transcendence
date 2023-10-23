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
let GameGateway = exports.GameGateway = class GameGateway {
    constructor(gameService, jwt, config) {
        this.gameService = gameService;
        this.jwt = jwt;
        this.config = config;
        this.gameStarted = false;
        this.connectedClients = new Map();
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
                this.connectedClients.set(payload.id, client);
            }
        }
        else {
            client.disconnect();
        }
        this.checkStartGame();
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
            }
        }
        this.checkStartGame();
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
    determineGameResult() {
        const clientIds = Array.from(this.connectedClients.keys());
        if (this.gameService.score.left === 5) {
            this.connectedClients.get(clientIds[0]).emit('gameResult', 'Winner');
            this.connectedClients.get(clientIds[1]).emit('gameResult', 'Loser');
        }
        else if (this.gameService.score.right === 5) {
            this.connectedClients.get(clientIds[0]).emit('gameResult', 'Loser');
            this.connectedClients.get(clientIds[1]).emit('gameResult', 'Winner');
        }
    }
    async moveBall() {
        while (this.gameStarted) {
            const data = await this.gameService.moveBall();
            if (data === 'reset') {
                const data = await this.gameService.resetGame();
                this.connectedClients.forEach((connectedClient) => {
                    connectedClient.emit('paddlesUpdate', data);
                    connectedClient.emit('score', this.gameService.score);
                });
                if (this.gameService.score.left === 5 || this.gameService.score.right === 5) {
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
    async handleUpdatePaddle(client, event) {
        const [clientId1, clientId2] = Array.from(this.connectedClients.keys());
        const targetPaddle = client.id === clientId1 ? 'leftPaddle' : 'rightPaddle';
        const gameData = await this.gameService.updatePaddle(event, targetPaddle);
        this.connectedClients.forEach((connectedClient) => {
            connectedClient.emit('paddlesUpdate', gameData);
        });
    }
    async botMode(client) {
        this.connectedClients.forEach((connectedClient) => {
            connectedClient.emit('startGame', this.gameService.gameData);
        });
    }
    checkStartGame() {
        if (this.connectedClients.size < 2 && this.gameStarted) {
            this.gameStarted = false;
        }
        if (this.connectedClients.size === 2) {
            this.gameStarted = true;
            this.broadcastGameData();
            this.moveBall();
        }
    }
    broadcastGameData() {
        this.connectedClients.forEach((connectedClient) => {
            connectedClient.emit('startGame', this.gameService.gameData);
        });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('paddlesUpdate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleUpdatePaddle", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('botMode'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "botMode", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'game', cors: true, origin: ['http://localhost:3000/game'] }),
    __metadata("design:paramtypes", [game_service_1.GameService,
        jwt_1.JwtService,
        config_1.ConfigService])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map