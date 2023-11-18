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
    const [client, setClient] = useState(false);
    const test = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState("");
    useEffect(() => {
        if (!socket) return;
        let canvas: any;
        const sketch = (p: p5) => {
            p.setup = () => {
                canvas = p.createCanvas(p.windowWidth / 2, p.windowHeight / 2);
                // canvas.position((p.windowWidth - canvas.width) / 2, (p.windowHeight - canvas.height) / 2);
                canvas.addClass("border-4 rounded-md bg-gray-800");
                canvas.style('border-color', '#213e46');
            };
            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth / 2, p.windowHeight / 2);
                if(gameDataRef.current)
                    updatePaddles(p, gameDataRef.current);
                // centerCanvas();
            };

            const centerCanvas = () => {
                canvas.position((p.windowWidth - p.width) / 2, (p.windowHeight - p.height) / 2);
            };
            socket.on('startGame', (data) => {
                gameDataRef.current = data.data;
                updatePaddles(p, data.data);
                updateBallData(p, data.data);
                setMode(data.mode);
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
                setBotGame(false);
                setCount(false);
                p.resizeCanvas(p.windowWidth / 2, p.windowHeight / 2);
                canvas.position();
                // centerCanvas();
            });
            socket.on('startBotGame', (data) => {
                console.log("startBotGame");
                updatePaddles(p, data);
                updateBallData(p, data);
                setBotGame(true);
            })
            socket.on('alreadyConnected', (data) => {
                setClient(true);
            })
            p.draw = () => {
                if(client) {
                    p.background('#151515');
                    p.fill(255);
                    p.textSize(34);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text("already in game", p.width / 2, p.height / 2);
                }
                else if(count || botGame) {
                    p.background('#151515');
                    p.stroke("#213D46");
                    p.strokeWeight(2);
                    p.line(p.width / 2, 0, p.width / 2, p.height);
                    p.fill("#213D46");
                    p.textSize(128);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text(leftScore, p.width / 4, p.height / 2);
                    p.text(rightScore, (p.width / 4) * 3, p.height / 2);
                    p.fill("#213D46");
                    p.noStroke();
                    p.rectMode(p.CENTER);
                    p.rect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
                    p.rect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
                    if(ball.pos === 1)
                        p.fill('#151515');
                    p.noStroke();
                    p.ellipse(ball.x, ball.y, ball.radius * 2);
                }
                else if (gameResult) {
                    p.background('#151515');
                    p.fill(255);
                    p.textSize(34);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text(gameResult, p.width / 2, p.height / 2);
                }
                else {
                    p.background('#151515');
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
        if(test && test.current) {
            const mp5 = new p5(sketch, test.current);
            return mp5.remove;
        }
    }),[];

    return (
        <div className='flex flex-col items-center justify-center h-screen no-scroll'>
            <div ref={test}>
                {/* Render the canvas here */}
            </div>
            <div className='mt-4'>
                {mode === "simple" && <p>Simple mode: [Classic ping pong mode. Use the arrow keys to control your paddle]</p>}
                {mode === "reverse" && <p>Reverse mode: [A twist on the traditional game. Clicking up makes your paddle move down, and clicking down makes your paddle move up]</p>}
                {mode === "hidden" && <p>Hidden mode: [In this mode, the ball remains hidden until it gets close to your paddle]</p>}
            </div>
        </div>
    )
};
export default GamePage;
