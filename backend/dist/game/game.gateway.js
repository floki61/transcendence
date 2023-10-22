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
let GameGateway = exports.GameGateway = class GameGateway {
    constructor(gameService) {
        this.gameService = gameService;
        this.gameStarted = false;
        this.connectedClients = new Map();
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
        this.connectedClients.set(client.id, client);
        this.checkStartGame();
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        this.connectedClients.delete(client.id);
        this.checkStartGame();
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
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'game', cors: true, origin: ['http://localhost:3000/game'] }),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map