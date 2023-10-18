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
const angle = Math.random() * (2 * Math.PI);
let GameGateway = exports.GameGateway = class GameGateway {
    constructor() {
        this.gameStarted = false;
        this.gameData = {
            canvasWidth: 850,
            canvasHeight: 400,
            paddleWidth: 15,
            paddleHeight: 80,
            ball: {
                x: 850 / 2,
                y: 400 / 2,
                radius: 10,
                xSpeed: 3,
                ySpeed: 0,
            },
            leftPaddle: {
                x: 15,
                y: 200,
                width: 15,
                height: 80,
                speed: 5,
            },
            rightPaddle: {
                x: 835,
                y: 200,
                width: 15,
                height: 80,
                speed: 5,
            },
        };
        this.connectedClients = new Map();
        this.map = function (n, start1, stop1, start2, stop2, withinBounds) {
            const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
            if (!withinBounds) {
                return newval;
            }
            if (start2 < stop2) {
                return this.constrain(newval, start2, stop2);
            }
            else {
                return this.constrain(newval, stop2, start2);
            }
        };
    }
    mapValue(value, start1, stop1, start2, stop2) {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    }
    async moveBall() {
        while (this.gameStarted) {
            if (this.gameData.ball.y < 0 || this.gameData.ball.y > this.gameData.canvasHeight - this.gameData.ball.radius)
                this.gameData.ball.ySpeed *= -1;
            else if (this.gameData.ball.x < 0 || this.gameData.ball.x > this.gameData.canvasWidth) {
                this.gameData.ball.x = this.gameData.canvasWidth / 2;
                this.gameData.ball.y = this.gameData.canvasHeight / 2;
            }
            else {
                if (ballHitsPaddle(this.gameData.ball, this.gameData.leftPaddle)) {
                    const diff = this.gameData.ball.y - (this.gameData.leftPaddle.y - this.gameData.leftPaddle.height / 2);
                    const rad = (45 * Math.PI) / 180;
                    const angle = this.mapValue(diff, 0, this.gameData.leftPaddle.height, -rad, rad);
                    this.gameData.ball.xSpeed = 5 * Math.cos(angle);
                    this.gameData.ball.ySpeed = 5 * Math.sin(angle);
                    this.gameData.ball.x = this.gameData.leftPaddle.x + this.gameData.leftPaddle.width / 2 + this.gameData.ball.radius;
                }
                if (ballHitsPaddle(this.gameData.ball, this.gameData.rightPaddle)) {
                    const diff = this.gameData.ball.y - (this.gameData.rightPaddle.y - this.gameData.rightPaddle.height / 2);
                    const rad = 225 * (Math.PI / 180);
                    const radd = 135 * (Math.PI / 180);
                    const angle = this.map(diff, 0, this.gameData.rightPaddle.height, rad, radd);
                    this.gameData.ball.xSpeed = 5 * Math.cos(angle);
                    this.gameData.ball.ySpeed = 5 * Math.sin(angle);
                    this.gameData.ball.x = this.gameData.rightPaddle.x - this.gameData.rightPaddle.width / 2 - this.gameData.ball.radius;
                }
            }
            this.gameData.ball.x += this.gameData.ball.xSpeed;
            this.gameData.ball.y += this.gameData.ball.ySpeed;
            this.connectedClients.forEach((connectedClient) => {
                connectedClient.emit('updateBall', this.gameData.ball);
            });
            await new Promise((resolve) => setTimeout(resolve, 1000 / 60));
        }
    }
    handlePaddleUpdate(client, event) {
        const [clientId1, clientId2] = Array.from(this.connectedClients.keys());
        const targetPaddle = client.id === clientId1 ? 'leftPaddle' : 'rightPaddle';
        if (event === 'UP') {
            if (this.gameData[targetPaddle].y > this.gameData[targetPaddle].height / 2) {
                this.gameData[targetPaddle].y -= this.gameData[targetPaddle].speed;
            }
        }
        else if (event === 'DOWN') {
            if (this.gameData[targetPaddle].y < this.gameData.canvasHeight - this.gameData[targetPaddle].height / 2) {
                this.gameData[targetPaddle].y += this.gameData[targetPaddle].speed;
            }
        }
        this.updateGameData({ [targetPaddle]: this.gameData[targetPaddle] });
        this.connectedClients.forEach((connectedClient) => {
            connectedClient.emit('paddlesUpdate', this.gameData);
        });
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
    handleUpdatePaddle(client, event) {
        this.handlePaddleUpdate(client, event);
    }
    checkStartGame() {
        if (this.connectedClients.size === 2) {
            this.gameStarted = true;
            this.broadcastGameData();
            this.moveBall();
        }
    }
    updateGameData(update) {
        this.gameData = { ...this.gameData, ...update };
    }
    broadcastGameData() {
        this.connectedClients.forEach((connectedClient) => {
            connectedClient.emit('startGame', this.gameData);
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
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleUpdatePaddle", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true })
], GameGateway);
function ballHitsPaddle(ball, paddle) {
    return (ball.x - ball.radius < paddle.x + paddle.width / 2 &&
        ball.x + ball.radius > paddle.x - paddle.width / 2 &&
        ball.y + ball.radius > paddle.y - paddle.height / 2 &&
        ball.y - ball.radius < paddle.y + paddle.height / 2);
}
//# sourceMappingURL=game.gateway.js.map