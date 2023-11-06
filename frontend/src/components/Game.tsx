"use client"
import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import { useGame } from '@/context/gameSocket';
import {leftPaddle, rightPaddle, ball, leftScore, rightScore, updatePaddles, updateBallData,updateScore } from '@/gameLogic/gameLogic';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { Changa } from 'next/font/google';

const GamePage = () => {
    const p5Ref = useRef();
    const {socket} = useGame();
    const gameDataRef = useRef(null);
    const [count, setCount] = useState(false);
    const [gameResult, setGameResult] = useState(null);
    const [botGame, setBotGame] = useState(false);

    useEffect(() => {
        if (!socket) return;
        let canvas: any;
        const sketch = (p: p5) => {
            // let img: any;
            // p.preload = () => {
                // img = p.loadImage("/one-piece.jpg");
            // };
            p.setup = () => {
                canvas = p.createCanvas(p.windowWidth / 2, p.windowHeight / 2);
                canvas.position((p.windowWidth - canvas.width) / 2, (p.windowHeight - canvas.height) / 2);
                p.background('#151515');
                canvas.addClass("border-4 rounded-md bg-gray-800");
                canvas.style('border-color', '#213e46');
                // if (img && img.width && img.height) {
                    // p.image(img, 0, 0, p.width, p.height);
                // }
            };
            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth / 2, p.windowHeight / 2);
                if(gameDataRef.current)
                    updatePaddles(p, gameDataRef.current);
                centerCanvas();
            };

            const centerCanvas = () => {
                canvas.position((p.windowWidth - p.width) / 2, (p.windowHeight - p.height) / 2);
            };
            socket.on('startGame', (data) => {
                gameDataRef.current = data;
                updatePaddles(p, data);
                updateBallData(p, data);
                setCount(true);
            });
            socket.on('paddlesUpdate', (data) => {
                gameDataRef.current = data;
                updatePaddles(p, data);
            });
            socket.on('updateBall', (data) => {
                 updateBallData(p, data);
                 updateScore(data);
                 if(botGame)
                    updatePaddles(p, data);
            });
            socket.on('gameResult', (data) => {
                setGameResult(data);
                console.log(data);
                setBotGame(false);
                setCount(false);
            });
            socket.on('startBotGame', (data) => {
                console.log("startBotGame");
                updatePaddles(p, data);
                updateBallData(p, data);
                setBotGame(true);
                // setCount(true);
            })
            p.draw = () => {
                if(count || botGame) {
                    p.background('#151515');
                    // p.image(img, 0, 0, p.width, p.height);
                    p.textSize(128);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text(leftScore, p.width / 4, p.height / 2);
                    p.text(rightScore, (p.width / 4) * 3, p.height / 2);
                    p.fill(255);
                    p.rectMode(p.CENTER);
                    p.rect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
                    p.rect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
                    p.fill(255);
                    p.ellipse(ball.x, ball.y, ball.radius * 2);
                }
                else if (gameResult) {
                    p.background('#151515');
                    // p.image(img, 0, 0, p.width, p.height);
                    p.fill(255);
                    p.textSize(34);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text(gameResult, p.width / 2, p.height / 2);
                }
                else {
                    p.background('#151515');
                    // p.image(img, 0, 0, p.width, p.height);
                    p.fill(255);
                    p.textSize(34);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text("waiting for players...", p.width / 2, p.height / 2);
                }
                if(count && leftPaddle.x && rightPaddle.x) {
                    if (p.keyIsDown(p.UP_ARROW))
                        socket.emit("paddlesUpdate", "UP");
                    else if(p.keyIsDown(p.DOWN_ARROW))
                        socket.emit("paddlesUpdate", "DOWN");
                }
                else if(botGame && leftPaddle.x && rightPaddle.x) {
                    if (p.keyIsDown(p.UP_ARROW))
                        socket.emit("paddleBotUpdate", "UP");
                    else if(p.keyIsDown(p.DOWN_ARROW))
                        socket.emit("paddleBotUpdate", "DOWN");
                }
            };
        };
        const mp5 = new p5(sketch, p5Ref.current);
        return mp5.remove;
        }),[];

        return (
        // <div>
        <div>
            {/* Render the canvas here */}
        </div>
    );
};
export default GamePage;
