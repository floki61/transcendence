import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

const angle: number = Math.random() * (2 * Math.PI);
// const xSpeed: number = 5 * Math.cos(angle);
// const ySpeed: number = 5 * Math.sin(angle);

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server;
    private gameStarted = false;
    private gameData = {
        canvasWidth: 850,
        canvasHeight: 400,
        paddleWidth: 15,
        paddleHeight: 80,
        ball: {
            x: 850 / 2,
            y: 400 / 2,
            radius: 10,
            xSpeed: 5 * Math.cos(angle),
            ySpeed: 5 * Math.sin(angle),
            // xSpeed: 3,
            // ySpeed: 1,
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
    private connectedClients: Map<string, Socket> = new Map<string, Socket>();
    

    mapValue(value: number, start1: number, stop1: number, start2: number, stop2: number): number {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    }
    map = function (
        n: number,
        start1: number,
        stop1: number,
        start2: number,
        stop2: number,
        withinBounds?: boolean
      ) {
        const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
        if (!withinBounds) {
          return newval;
        }
        if (start2 < stop2) {
          return this.constrain(newval, start2, stop2);
        } else {
          return this.constrain(newval, stop2, start2);
        }
      };
      
    private async moveBall() {
        while(this.gameStarted) {
            if (this.gameData.ball.y < 0 || this.gameData.ball.y > this.gameData.canvasHeight - this.gameData.ball.radius)
                this.gameData.ball.ySpeed *= -1;
            else if (this.gameData.ball.x < 0 || this.gameData.ball.x > this.gameData.canvasWidth) {
                this.gameData.ball.x = this.gameData.canvasWidth / 2;
                this.gameData.ball.y = this.gameData.canvasHeight / 2;
            }
            else {
                if (ballHitsPaddle(this.gameData.ball, this.gameData.leftPaddle)) {
                    const diff = this.gameData.ball.y - (this.gameData.leftPaddle.y - this.gameData.leftPaddle.height / 2);
                    const rad = (45 * Math.PI ) / 180;
                    const angle = this.mapValue(diff, 0, this.gameData.leftPaddle.height, -rad, rad);
                    this.gameData.ball.xSpeed = 5 * Math.cos(angle);
                    this.gameData.ball.ySpeed = 5 * Math.sin(angle);
                    // this.gameData.ball.xSpeed *= -1;
                    this.gameData.ball.x = this.gameData.leftPaddle.x + this.gameData.leftPaddle.width / 2 + this.gameData.ball.radius;
                }
                if (ballHitsPaddle(this.gameData.ball, this.gameData.rightPaddle)) {
                    const diff = this.gameData.ball.y - (this.gameData.rightPaddle.y - this.gameData.rightPaddle.height / 2);
                    const rad = 135 * Math.PI / 180;
                    const angle = this.map(diff, 0, this.gameData.rightPaddle.height, -rad, rad);
                    this.gameData.ball.xSpeed = 5 * Math.cos(angle);
                    this.gameData.ball.ySpeed = 5 * Math.sin(angle);
                    // this.gameData.ball.xSpeed *= -1;
                    this.gameData.ball.x = this.gameData.rightPaddle.x - this.gameData.rightPaddle.width / 2 - this.gameData.ball.radius;
                }
            }

            this.gameData.ball.x += this.gameData.ball.xSpeed;
            this.gameData.ball.y += this.gameData.ball.ySpeed;
        
            this.connectedClients.forEach((connectedClient) => {
              connectedClient.emit('updateBall', this.gameData.ball);
            });
            await new Promise((resolve) => setTimeout(resolve, 1000 / 60)); // Assuming 60 FPS
        }
    }

    private handlePaddleUpdate(client: Socket, event) {
        const [clientId1, clientId2] = Array.from(this.connectedClients.keys());
        const targetPaddle = client.id === clientId1 ? 'leftPaddle' : 'rightPaddle';

        if (event === 'UP') {
            if (this.gameData[targetPaddle].y > this.gameData[targetPaddle].height / 2) {
                this.gameData[targetPaddle].y -= this.gameData[targetPaddle].speed;
            }
        } else if (event === 'DOWN') {
            if (this.gameData[targetPaddle].y < this.gameData.canvasHeight - this.gameData[targetPaddle].height / 2) {
                this.gameData[targetPaddle].y += this.gameData[targetPaddle].speed;
            }
        }
        this.updateGameData({ [targetPaddle]: this.gameData[targetPaddle] });
        this.connectedClients.forEach((connectedClient) => {
            connectedClient.emit('paddlesUpdate', this.gameData);
        });
    }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
        this.connectedClients.set(client.id, client);
        this.checkStartGame();
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
        this.connectedClients.delete(client.id);
        this.checkStartGame();
    }
    @SubscribeMessage('paddlesUpdate')
    handleUpdatePaddle(client: Socket, event) {
        this.handlePaddleUpdate(client, event);
    }

    private checkStartGame() {
        if (this.connectedClients.size === 2) {
            this.gameStarted = true;
            this.broadcastGameData();
            this.moveBall();
        }
    }
    
    private updateGameData(update) {
        this.gameData = { ...this.gameData, ...update };
    }
    
    private broadcastGameData() {
        this.connectedClients.forEach((connectedClient) => {
            connectedClient.emit('startGame', this.gameData);
        });
    }
}
// function moveBall() {
//     ball.x += ball.xSpeed;
//     ball.y += ball.ySpeed;
//     io.sockets.emit('updateBall', ball);
//   }
function ballHitsPaddle(ball, paddle) {
return (
    ball.x - ball.radius < paddle.x + paddle.width / 2 &&
    ball.x + ball.radius > paddle.x - paddle.width / 2 &&
    ball.y + ball.radius > paddle.y - paddle.height / 2 &&
    ball.y - ball.radius < paddle.y + paddle.height / 2
    // ball.x - ball.radius > paddle.x - paddle.width / 2
);
}

