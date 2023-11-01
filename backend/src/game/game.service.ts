import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';

@Injectable()
export class GameService 
{
    constructor(private eventEmitter: EventEmitter2
        ) { }
    private initialGameData = {
        canvasWidth: 850,
        canvasHeight: 400,
        paddleWidth: 15,
        paddleHeight: 80,
        ball: {
            x: 850 / 2,
            y: 400 / 2,
            radius: 10,
            // xSpeed: 5 * Math.cos(Math.random() * (2 * Math.PI)),
            // ySpeed: 5 * Math.sin(Math.random() * (2 * Math.PI)),
            xSpeed: 5 * Math.random() < 0.5 ? 1 : -1,
            ySpeed: 5 * Math.random() < 0.5 ? 1 : -1,
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

    private deepCopy(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }

    public gameData = this.deepCopy(this.initialGameData);

    getGameData() {
        return this.deepCopy(this.initialGameData);
    }
    resetBall(data) {
        // this.gameData = this.deepCopy(this.initialGameData);
        data.ball.x = 850 / 2;
        data.ball.y = 400 / 2;
        // this.gameData.ball.xSpeed = 5 * Math.cos(Math.random() * (2 * Math.PI));
        // this.gameData.ball.ySpeed = 5 * Math.sin(Math.random() * (2 * Math.PI));
        data.ball.xSpeed = 5 *  Math.random() < 0.5 ? 1 : -1;
        data.ball.ySpeed = 5 *  Math.random() < 0.5 ? 1 : -1;
        return ;
        // return data;

    }
    resetScore() {
        this.gameData.score.left = 0;
        this.gameData.score.right = 0;
    }
    async updatePaddle(event: string, targetPaddle: string) {
        if (event === 'UP') {
            if (this.gameData[targetPaddle].y > this.gameData[targetPaddle].height / 2) {
                this.gameData[targetPaddle].y -= this.gameData[targetPaddle].speed;
            }
        } else if (event === 'DOWN') {
            if (this.gameData[targetPaddle].y < this.gameData.canvasHeight - this.gameData[targetPaddle].height / 2) {
                this.gameData[targetPaddle].y += this.gameData[targetPaddle].speed;
            }
        }
        return this.gameData;
    }
    async updateBotPaddle(event: string, data) {
        if (event === 'UP') {
            if (data.leftPaddle.y > data.leftPaddle.height / 2) {
                data.leftPaddle.y -= data.leftPaddle.speed;
            }
        } else if (event === 'DOWN') {
            if (data.leftPaddle.y < data.canvasHeight - data.leftPaddle.height / 2) {
                data.leftPaddle.y += data.leftPaddle.speed;
            }
        }
        return this.gameData;
    }

    private map(value: number, start1: number, stop1: number, start2: number, stop2: number): number {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    }
 
    private ballHitsPaddle(ball, paddle) {
        return (
            ball.x - ball.radius < paddle.x + paddle.width / 2 &&
            ball.x + ball.radius > paddle.x - paddle.width / 2 &&
            ball.y + ball.radius > paddle.y - paddle.height / 2 &&
            ball.y - ball.radius < paddle.y + paddle.height / 2
            // ball.x - ball.radius > paddle.x - paddle.width / 2
        );
    }
    private radians(deg: number) {
        return (deg * Math.PI) / 180.0;
    };

    async moveBall(data) {
        if (data.ball.y < 0 || data.ball.y > data.canvasHeight - data.ball.radius)
            data.ball.ySpeed *= -1;
        else if (data.ball.x < 0 || data.ball.x > data.canvasWidth){
            if(data.ball.x < 0)
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
                data.ball.xSpeed = 5 * Math.cos(angle);
                data.ball.ySpeed = 5 * Math.sin(angle);
                data.ball.x = data.leftPaddle.x + data.leftPaddle.width / 2 + data.ball.radius;
            }
            if (this.ballHitsPaddle(data.ball, data.rightPaddle)) {
                const diff = data.ball.y - (data.rightPaddle.y - data.rightPaddle.height / 2);
                const angle = this.map(diff, 0, data.rightPaddle.height, this.radians(225), this.radians(135));
                data.ball.xSpeed = 5 * Math.cos(angle);
                data.ball.ySpeed = 5 * Math.sin(angle);
                data.ball.x = data.rightPaddle.x - data.rightPaddle.width / 2 - data.ball.radius;
            }
        }
        data.ball.x += data.ball.xSpeed;
        data.ball.y += data.ball.ySpeed;
        // return data;
    }
    async moveBot(data) {
        if(data.ball.xSpeed < 0 || data.ball.x < data.canvasWidth / 2)
            return ;
        if(data.rightPaddle.y > data.ball.y && data.rightPaddle.y - data.rightPaddle.height / 2 > data.ball.y && data.rightPaddle.y > data.rightPaddle.height / 2)
            data.rightPaddle.y -= data.rightPaddle.speed;
        else if(data.rightPaddle.y < data.ball.y && data.rightPaddle.y + data.rightPaddle.height / 2 < data.ball.y && data.rightPaddle.y < data.canvasHeight - data.rightPaddle.height / 2)
            data.rightPaddle.y += data.rightPaddle.speed;
        // return data;
    }
    // async moveBot() {
    //     if(ball.xSpeed < 0 || ball.x < p.width / 2)
    //         return ;
    //     if(rightPaddle.y > ball.y && rightPaddle.y - rightPaddle.height / 2 > ball.y && rightPaddle.y > rightPaddle.height / 2)
    //         rightPaddle.y -= rightPaddle.speed;
    //     else if(rightPaddle.y < ball.y && rightPaddle.y + rightPaddle.height / 2 < ball.y && rightPaddle.y < p.height - rightPaddle.height / 2)
    //         rightPaddle.y += rightPaddle.speed;
    // }

    // async Quee(id: any) {
    //     this.eventEmitter.emit('quee', id);
    // }

    // async Botgame(id: any) {
    //     this.eventEmitter.emit('Botgame', id);
    // }
}
