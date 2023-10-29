import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class GameService 
{
    private initialGameData = {
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

    private deepCopy(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }

    public gameData = this.deepCopy(this.initialGameData);

    resetGame() {
        // this.gameData = this.deepCopy(this.initialGameData);
        this.gameData.ball.x = 850 / 2;
        this.gameData.ball.y = 400 / 2;
        // this.gameData.ball.xSpeed = 5 * Math.cos(Math.random() * (2 * Math.PI));
        // this.gameData.ball.ySpeed = 5 * Math.sin(Math.random() * (2 * Math.PI));
        this.gameData.ball.xSpeed = 5 *  Math.random() < 0.5 ? 1 : -1;
        this.gameData.ball.ySpeed = 5 *  Math.random() < 0.5 ? 1 : -1;

        return this.gameData;

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

    async moveBall() {
        if (this.gameData.ball.y < 0 || this.gameData.ball.y > this.gameData.canvasHeight - this.gameData.ball.radius)
            this.gameData.ball.ySpeed *= -1;
        else if (this.gameData.ball.x < 0 || this.gameData.ball.x > this.gameData.canvasWidth){
            if(this.gameData.ball.x < 0)
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
        if(this.gameData.ball.xSpeed < 0 || this.gameData.ball.x < this.gameData.canvasWidth / 2)
            return ;
        if(this.gameData.rightPaddle.y > this.gameData.ball.y && this.gameData.rightPaddle.y - this.gameData.rightPaddle.height / 2 > this.gameData.ball.y && this.gameData.rightPaddle.y > this.gameData.rightPaddle.height / 2)
            this.gameData.rightPaddle.y -= this.gameData.rightPaddle.speed;
        else if(this.gameData.rightPaddle.y < this.gameData.ball.y && this.gameData.rightPaddle.y + this.gameData.rightPaddle.height / 2 < this.gameData.ball.y && this.gameData.rightPaddle.y < this.gameData.canvasHeight - this.gameData.rightPaddle.height / 2)
            this.gameData.rightPaddle.y += this.gameData.rightPaddle.speed;
    }
    // async moveBot() {
    //     if(ball.xSpeed < 0 || ball.x < p.width / 2)
    //         return ;
    //     if(rightPaddle.y > ball.y && rightPaddle.y - rightPaddle.height / 2 > ball.y && rightPaddle.y > rightPaddle.height / 2)
    //         rightPaddle.y -= rightPaddle.speed;
    //     else if(rightPaddle.y < ball.y && rightPaddle.y + rightPaddle.height / 2 < ball.y && rightPaddle.y < p.height - rightPaddle.height / 2)
    //         rightPaddle.y += rightPaddle.speed;
    // }
}
