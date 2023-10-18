"use client"
import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import { useSocket } from './SocketContext';
import { data } from 'autoprefixer';

let leftPaddleX = null, leftPaddleY = null, leftPaddleWidth = null, leftPaddleHeight = null;
let rightPaddleX = null, rightPaddleY = null, rightPaddleWidth = null, rightPaddleHeight = null;
let ballX = null, ballY = null, radius = null;
const GamePage = () => {
    const p5Ref = useRef();
    const socket = useSocket();
    const [gameData, setGameData] = useState(null);
    const gameDataRef = useRef(null);
    const [count, setCount] = useState(false);

    function updatePaddle(p, data) {
        leftPaddleX = (data.leftPaddle.x * (p.windowWidth / 2)) / data.canvasWidth;
        leftPaddleY = (data.leftPaddle.y * (p.windowHeight / 2)) / data.canvasHeight;    
        leftPaddleWidth = (data.leftPaddle.width / data.canvasWidth) * p.width;
        leftPaddleHeight = (data.leftPaddle.height / data.canvasHeight) * p.height;

        rightPaddleX = (data.rightPaddle.x / data.canvasWidth) * p.width;
        rightPaddleY = (data.rightPaddle.y / data.canvasHeight) * p.height;                
        rightPaddleWidth = (data.rightPaddle.width / data.canvasWidth) * p.width;
        rightPaddleHeight = (data.rightPaddle.height / data.canvasHeight) * p.height;

    }
    function updateBall(p, data) {
        if(gameData) {
            ballX  = (data.x * (p.windowWidth / 2)) / gameData.canvasWidth;
            ballY  = (data.y * (p.windowHeight / 2)) / gameData.canvasHeight;
            radius  = (data.radius * (p.windowHeight / 2)) / gameData.canvasHeight;
        }
    }
    useEffect(() => {
        let canvas;
        const sketch = (p) => {
            
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
                setGameData(data);
                updatePaddle(p, data);
                updateBall(p, data.ball);
                setCount(true);
            });
            socket.on('paddlesUpdate', (data) => {
                gameDataRef.current = data;
                updatePaddle(p, data);
            });
             socket.on('updateBall', (data) => {
                 updateBall(p, data);
            });
            p.draw = () => {
                if(count) {
                    p.background(0);
                    if (leftPaddleX && rightPaddleX) {
                        p.fill(255);
                        p.rectMode(p.CENTER);
                        p.rect(leftPaddleX, leftPaddleY, leftPaddleWidth, leftPaddleHeight);
                        p.rect(rightPaddleX, rightPaddleY, rightPaddleWidth, rightPaddleHeight);
                    }
                    p.fill(255);
                    p.ellipse(ballX, ballY, radius * 2);
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
