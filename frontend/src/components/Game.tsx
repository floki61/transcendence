"use client"
import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import { useGame } from '@/context/gameSocket';

let leftPaddleX: any = null, leftPaddleY: any  = null, leftPaddleWidth: any  = null, leftPaddleHeight: any  = null;
let rightPaddleX: any  = null, rightPaddleY: any  = null, rightPaddleWidth: any  = null, rightPaddleHeight: any  = null;
let ballX: any  = null, ballY: any  = null, radius: any  = null;
let leftScore = 0, rightScore = 0;


const GamePage = () => {
    const p5Ref = useRef();
    const {socket} = useGame();
    const gameDataRef = useRef(null);
    const [count, setCount] = useState(false);
    const [gameResult, setGameResult] = useState(null);

    function updatePaddle(p: p5, data: any) {
        leftPaddleX = (data.leftPaddle.x * (p.windowWidth / 2)) / data.canvasWidth;
        leftPaddleY = (data.leftPaddle.y * (p.windowHeight / 2)) / data.canvasHeight;    
        leftPaddleWidth = (data.leftPaddle.width / data.canvasWidth) * p.width;
        leftPaddleHeight = (data.leftPaddle.height / data.canvasHeight) * p.height;

        rightPaddleX = (data.rightPaddle.x / data.canvasWidth) * p.width;
        rightPaddleY = (data.rightPaddle.y / data.canvasHeight) * p.height;                
        rightPaddleWidth = (data.rightPaddle.width / data.canvasWidth) * p.width;
        rightPaddleHeight = (data.rightPaddle.height / data.canvasHeight) * p.height;

    }
    function updateBall(p: p5, data: any) {
        if(data.ball) {
            ballX  = (data.ball.x * (p.windowWidth / 2)) / data.canvasWidth;
            ballY  = (data.ball.y * (p.windowHeight / 2)) / data.canvasHeight;
            radius  = (data.ball.radius * (p.windowHeight / 2)) / data.canvasHeight;
        }
    }
    useEffect(() => {
        if (!socket) return;
        let canvas: any;
        const sketch = (p: p5) => {
            p.setup = () => {
                canvas = p.createCanvas(p.windowWidth / 2, p.windowHeight / 2);
                canvas.position((p.windowWidth - canvas.width) / 2, (p.windowHeight - canvas.height) / 2);
                p.background("black");
            };    
            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth / 2, p.windowHeight / 2);
                if(gameDataRef.current)
                    updatePaddle(p, gameDataRef.current);
                centerCanvas();
            };

            const centerCanvas = () => {
                canvas.position((p.windowWidth - p.width) / 2, (p.windowHeight - p.height) / 2);
            };
            socket.on('startGame', (data) => {
                updatePaddle(p, data);
                updateBall(p, data);
                setCount(true);
            });
            socket.on('paddlesUpdate', (data) => {
                gameDataRef.current = data;
                updatePaddle(p, data);
            });
            socket.on('updateBall', (data) => {
                 updateBall(p, data);
            });
            socket.on('score', (data) => {
                leftScore = data.left;
                rightScore = data.right;
            });
            socket.on('gameResult', (data) => {
                setGameResult(data);
                setCount(false);
            });
            p.draw = () => {
                if(count) {
                    p.background(0);
                    p.textSize(128);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text(leftScore, p.width / 4, p.height / 2);
                    p.text(rightScore, (p.width / 4) * 3, p.height / 2);
                    if (leftPaddleX && rightPaddleX) {
                        p.fill(255);
                        p.rectMode(p.CENTER);
                        p.rect(leftPaddleX, leftPaddleY, leftPaddleWidth, leftPaddleHeight);
                        p.rect(rightPaddleX, rightPaddleY, rightPaddleWidth, rightPaddleHeight);
                    }
                    p.fill(255);
                    p.ellipse(ballX, ballY, radius * 2);
                }
                else if (gameResult) {
                    p.background(0);
                    p.fill(255);
                    p.textSize(34);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text(gameResult, p.width / 2, p.height / 2);
                }
                else {
                    p.background(0);
                    p.fill(255);
                    p.textSize(34);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text("waiting for players...", p.width / 2, p.height / 2);
                }
                if(count && leftPaddleX && rightPaddleX) {
                    if (p.keyIsDown(p.UP_ARROW))
                        socket.emit("paddlesUpdate", "UP");
                    else if(p.keyIsDown(p.DOWN_ARROW))
                        socket.emit("paddlesUpdate", "DOWN");
                }
            };
        };
        const mp5 = new p5(sketch, p5Ref.current);
        return mp5.remove;
        }),[];

        return (
        <div>
            {/* Render the canvas here */}
        </div>
    );
};
export default GamePage;
