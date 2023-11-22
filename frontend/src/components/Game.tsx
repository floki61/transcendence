"use client"
import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import { useGame } from '@/context/gameSocket';
import {leftPaddle, rightPaddle, ball, leftScore, rightScore, updatePaddles, updateBallData,updateScore } from '@/gameLogic/gameLogic';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { Changa } from 'next/font/google';
import Image from 'next/image'

interface usersData {
    player1: {
        img: string;
        name: string;
        level: string;
    };
    player2: {
        img: string;
        name: string;
        level: string;
    };
    mode: string;
}


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
    const [usersData, setUsersData] = useState<usersData>();
    const playersDiv = document.getElementById('players');

    useEffect(() => {
        if (!socket) return;
        let canvas: any;
        const sketch = (p: p5) => {
            p.setup = () => {
                canvas = p.createCanvas(window.innerWidth / 2, window.innerHeight / 2);
                canvas.addClass("border-4 rounded-md bg-gray-800");
                canvas.style('border-color', '#213e46');
                if (playersDiv)
                    playersDiv.style.width = `${p.width}px`;
            };
            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth / 2, p.windowHeight / 2);
                if (playersDiv)
                    playersDiv.style.width = `${p.width}px`;
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
                updatePaddles(p, data);
            });
            socket.on('gameResult', (data) => {
                setGameResult(data);
                setBotGame(false);
                setCount(false);
            });
            socket.on('startBotGame', (data) => {
                console.log("startBotGame");
                updatePaddles(p, data.gameData);
                updateBallData(p, data.gameData);
                setUsersData(data.userData);
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
        <div className='flex flex-col items-center justify-center h-screen'>
        <div id='players' className='flex justify-between items-center mb-6 '>
            <div className='flex items-center'>
                <Image src={usersData?.player1?.img || "/placeholder.jpg"} alt='Player 1' className='rounded-full' width={70} height={70} />
                <div className='flex flex-col items-center ml-4'>
                    <p className=''>{usersData?.player1 && usersData.player1.name}</p>
                    <span className="text-xs">{usersData?.player1 && `lvl ${usersData.player1.level}`}</span>
                </div>
            </div>
            <div className='flex items-center'>
                <span> {leftScore} - {rightScore}</span>
            </div>
            <div className='flex items-center'>
                <div className='flex flex-col items-center mr-4'>
                    <p className=''>{usersData?.player2 && usersData.player2.name}</p>
                    <span className='text-xs'>{usersData?.player2 && `lvl ${usersData.player2.level}`}</span>
                </div>
                <img src={usersData?.player2?.img || "/placeholder.jpg"} alt='Player 2' className='rounded-full' width={70} height={70}/>
            </div>
        </div>
        <div className='' ref={test}></div>
        <div className='mt-4' style={{opacity: '0.5'}}>
            {usersData?.mode === "Bot" && <p>! Bot mode: [Play against a bot]</p>}
            {usersData?.mode === "simple" && <p>! Simple mode: [Classic ping pong mode. Use the arrow keys to control your paddle]</p>}
            {usersData?.mode === "reverse" && <p>! Reverse mode: [A twist on the traditional game. Clicking up makes your paddle move down, and clicking down makes your paddle move up]</p>}
            {usersData?.mode === "hidden" && <p>! Hidden mode: [In this mode, the ball remains hidden until it gets close to your paddle]</p>}
        </div>
    </div>
    )
};
export default GamePage;
