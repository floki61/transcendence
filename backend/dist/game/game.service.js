"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
let GameService = exports.GameService = class GameService {
    constructor() {
        this.initialGameData = {
            canvasWidth: 850,
            canvasHeight: 400,
            paddleWidth: 15,
            paddleHeight: 80,
            ball: {
                x: 850 / 2,
                y: 400 / 2,
                radius: 10,
                xSpeed: 5 * Math.cos(Math.random() * (2 * Math.PI)),
                ySpeed: 5 * Math.sin(Math.random() * (2 * Math.PI)),
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
    resetGame() {
        this.gameData.ball.x = 850 / 2;
        this.gameData.ball.y = 400 / 2;
        this.gameData.ball.xSpeed = 5 * Math.random() < 0.5 ? 1 : -1;
        this.gameData.ball.ySpeed = 5 * Math.random() < 0.5 ? 1 : -1;
        return this.gameData;
    }
    resetScore() {
        this.gameData.score.left = 0;
        this.gameData.score.right = 0;
    }
    async updatePaddle(event, targetPaddle) {
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
        return this.gameData;
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
    async moveBall() {
        if (this.gameData.ball.y < 0 || this.gameData.ball.y > this.gameData.canvasHeight - this.gameData.ball.radius)
            this.gameData.ball.ySpeed *= -1;
        else if (this.gameData.ball.x < 0 || this.gameData.ball.x > this.gameData.canvasWidth) {
            if (this.gameData.ball.x < 0)
                this.gameData.score.right++;
            else
                this.gameData.score.left++;
            return 'reset';
        }
        else {
            if (this.ballHitsPaddle(this.gameData.ball, this.gameData.leftPaddle)) {
                const diff = this.gameData.ball.y - (this.gameData.leftPaddle.y - this.gameData.leftPaddle.height / 2);
                const rad = this.radians(45);
                const angle = this.map(diff, 0, this.gameData.leftPaddle.height, -rad, rad);
                this.gameData.ball.xSpeed = 5 * Math.cos(angle);
                this.gameData.ball.ySpeed = 5 * Math.sin(angle);
                this.gameData.ball.x = this.gameData.leftPaddle.x + this.gameData.leftPaddle.width / 2 + this.gameData.ball.radius;
            }
            if (this.ballHitsPaddle(this.gameData.ball, this.gameData.rightPaddle)) {
                const diff = this.gameData.ball.y - (this.gameData.rightPaddle.y - this.gameData.rightPaddle.height / 2);
                const angle = this.map(diff, 0, this.gameData.rightPaddle.height, this.radians(225), this.radians(135));
                this.gameData.ball.xSpeed = 5 * Math.cos(angle);
                this.gameData.ball.ySpeed = 5 * Math.sin(angle);
                this.gameData.ball.x = this.gameData.rightPaddle.x - this.gameData.rightPaddle.width / 2 - this.gameData.ball.radius;
            }
        }
        this.gameData.ball.x += this.gameData.ball.xSpeed;
        this.gameData.ball.y += this.gameData.ball.ySpeed;
        return this.gameData;
    }
    async moveBot() {
        if (this.gameData.ball.xSpeed < 0 || this.gameData.ball.x < this.gameData.canvasWidth / 2)
            return;
        if (this.gameData.rightPaddle.y > this.gameData.ball.y && this.gameData.rightPaddle.y - this.gameData.rightPaddle.height / 2 > this.gameData.ball.y && this.gameData.rightPaddle.y > this.gameData.rightPaddle.height / 2)
            this.gameData.rightPaddle.y -= this.gameData.rightPaddle.speed;
        else if (this.gameData.rightPaddle.y < this.gameData.ball.y && this.gameData.rightPaddle.y + this.gameData.rightPaddle.height / 2 < this.gameData.ball.y && this.gameData.rightPaddle.y < this.gameData.canvasHeight - this.gameData.rightPaddle.height / 2)
            this.gameData.rightPaddle.y += this.gameData.rightPaddle.speed;
    }
};
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)()
], GameService);
//# sourceMappingURL=game.service.js.map