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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let GameService = exports.GameService = class GameService {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
        this.initialGameData = {
            canvasWidth: 850,
            canvasHeight: 400,
            paddleWidth: 15,
            paddleHeight: 80,
            ball: {
                x: 850 / 2,
                y: 400 / 2,
                radius: 10,
                speed: 5,
                xSpeed: 5 * (Math.random() < 0.5 ? 1 : -1),
                ySpeed: 5 * (Math.random() < 0.5 ? 1 : -1),
            },
            leftPaddle: {
                x: 15,
                y: 200,
                width: 15,
                height: 80,
                speed: 10,
            },
            rightPaddle: {
                x: 835,
                y: 200,
                width: 15,
                height: 80,
                speed: 5,
            },
            score: {
                left: 0,
                right: 0,
            }
        };
        this.gameData = this.deepCopy(this.initialGameData);
    }
    deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    getGameData() {
        return this.deepCopy(this.initialGameData);
    }
    resetBall(data) {
        data.ball.x = 850 / 2;
        data.ball.y = 400 / 2;
        data.ball.speed = 5;
        data.ball.xSpeed = data.ball.speed * (Math.random() < 0.5 ? 1 : -1);
        data.ball.ySpeed = data.ball.speed * (Math.random() < 0.5 ? 1 : -1);
        return;
    }
    resetScore() {
        this.gameData.score.left = 0;
        this.gameData.score.right = 0;
    }
    async updatePaddles(event, data, targetPaddle) {
        if (event === 'UP') {
            if (targetPaddle) {
                if (data.leftPaddle.y > data.leftPaddle.height / 2)
                    data.leftPaddle.y -= data.leftPaddle.speed;
            }
            else {
                if (data.rightPaddle.y > data.rightPaddle.height / 2)
                    data.rightPaddle.y -= data.rightPaddle.speed;
            }
        }
        else if (event === 'DOWN') {
            if (targetPaddle) {
                if (data.leftPaddle.y < data.canvasHeight - data.leftPaddle.height / 2)
                    data.leftPaddle.y += data.leftPaddle.speed;
            }
            else {
                if (data.rightPaddle.y < data.canvasHeight - data.rightPaddle.height / 2)
                    data.rightPaddle.y += data.rightPaddle.speed;
            }
        }
    }
    async updateBotPaddle(event, data) {
        if (event === 'UP') {
            if (data.leftPaddle.y > data.leftPaddle.height / 2) {
                data.leftPaddle.y -= data.leftPaddle.speed;
            }
        }
        else if (event === 'DOWN') {
            if (data.leftPaddle.y < data.canvasHeight - data.leftPaddle.height / 2) {
                data.leftPaddle.y += data.leftPaddle.speed;
            }
        }
    }
    map(value, start1, stop1, start2, stop2) {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    }
    ballHitsPaddle(ball, paddle) {
        return (ball.x - ball.radius < paddle.x + paddle.width / 2 &&
            ball.x + ball.radius > paddle.x - paddle.width / 2 &&
            ball.y + ball.radius > paddle.y - paddle.height / 2 &&
            ball.y - ball.radius < paddle.y + paddle.height / 2);
    }
    radians(deg) {
        return (deg * Math.PI) / 180.0;
    }
    ;
    async moveBall(data) {
        if (data.ball.y < 0 || data.ball.y > data.canvasHeight - data.ball.radius)
            data.ball.ySpeed *= -1;
        else if (data.ball.x < 0 || data.ball.x > data.canvasWidth) {
            if (data.ball.x < 0)
                data.score.right++;
            else
                data.score.left++;
            return 'reset';
        }
        else {
            if (this.ballHitsPaddle(data.ball, data.leftPaddle)) {
                const diff = data.ball.y - (data.leftPaddle.y - data.leftPaddle.height / 2);
                const rad = this.radians(45);
                const angle = this.map(diff, 0, data.leftPaddle.height, -rad, rad);
                data.ball.speed += 0.5;
                data.ball.xSpeed = data.ball.speed * Math.cos(angle);
                data.ball.ySpeed = data.ball.speed * Math.sin(angle);
                data.ball.x = data.leftPaddle.x + data.leftPaddle.width / 2 + data.ball.radius;
            }
            if (this.ballHitsPaddle(data.ball, data.rightPaddle)) {
                const diff = data.ball.y - (data.rightPaddle.y - data.rightPaddle.height / 2);
                const angle = this.map(diff, 0, data.rightPaddle.height, this.radians(225), this.radians(135));
                data.ball.speed += 0.5;
                data.ball.xSpeed = data.ball.speed * Math.cos(angle);
                data.ball.ySpeed = data.ball.speed * Math.sin(angle);
                data.ball.x = data.rightPaddle.x - data.rightPaddle.width / 2 - data.ball.radius;
            }
        }
        data.ball.x += data.ball.xSpeed;
        data.ball.y += data.ball.ySpeed;
    }
    async moveBot(data) {
        if (data.ball.xSpeed < 0 || data.ball.x < data.canvasWidth / 2)
            return;
        if (data.rightPaddle.y > data.ball.y && data.rightPaddle.y - data.rightPaddle.height / 2 > data.ball.y && data.rightPaddle.y > data.rightPaddle.height / 2)
            data.rightPaddle.y -= data.rightPaddle.speed;
        else if (data.rightPaddle.y < data.ball.y && data.rightPaddle.y + data.rightPaddle.height / 2 < data.ball.y && data.rightPaddle.y < data.canvasHeight - data.rightPaddle.height / 2)
            data.rightPaddle.y += data.rightPaddle.speed;
    }
};
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], GameService);
//# sourceMappingURL=game.service.js.map