"use client"
import React, { memo, useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import { useGame } from '@/context/gameSocket';
import {leftPaddle, rightPaddle, ball, leftScore, rightScore, updatePaddles, updateBallData,updateScore } from '@/gameLogic/gameLogic';
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
    const {socket} = useGame();
    const [liveGame, setLiveGame] = useState(false);
    const [gameResult, setGameResult] = useState(null);
    const [botGame, setBotGame] = useState(false);
    const [client, setClient] = useState(false);
    const test = useRef<HTMLDivElement>(null);
    const [usersData, setUsersData] = useState<usersData>();
    const playersDiv = document.getElementById('players');
    const [borderColor, setBorderColor] = useState('#213D46');
    const [playerPos, setPlayerPos] = useState(null);
    useEffect(() => {
        if (!socket) return;
        let canvas: any;
        const sketch = (p: p5) => {
            p.setup = () => {
                canvas = p.createCanvas(window.innerWidth / 2, window.innerHeight / 2);
                canvas.addClass("border-4 rounded-md bg-gray-800");
                canvas.style('border-color', borderColor);
                if (playersDiv)
                    playersDiv.style.width = `${p.width}px`;
            };
            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth / 2, p.windowHeight / 2);
                if (playersDiv)
                    playersDiv.style.width = `${p.width}px`;
            };
            socket.on('userData', (data) => {
                setUsersData(data);
            })
            socket.on('startBotGame', (data) => {
                setUsersData(data.userData);
                setPlayerPos(data.pos);
                updatePaddles(p, data.gameData);
                updateBallData(p, data.gameData);
                setBotGame(true);
            })
            socket.on('startGame', (data) => {
                setUsersData(data.userData);
                setPlayerPos(data.pos);
                updatePaddles(p, data.gameData);
                updateBallData(p, data.gameData);
                setLiveGame(true);
            });
            socket.on('paddlesUpdate', (data) => {
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
                setLiveGame(false);
            });
            socket.on('alreadyConnected', (data) => {
                setClient(true);
            })
            p.draw = () => {
                if(client) {
                    p.background('#151515');
                    p.fill(255);
                    p.fill(255, 255, 255, 30);
                    p.textSize(34);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text("already in game", p.width / 2, p.height / 2);
                }
                else if(liveGame || botGame) {
                    p.background('#151515');
                    p.stroke("#213D46");
                    p.strokeWeight(2);
                    if(usersData?.mode === "hidden") {
                        p.line(p.width / 4, 0, p.width / 4, p.height);
                        p.line((p.width / 4) * 3, 0, (p.width / 4) * 3, p.height);
                    }
                    else
                        p.line(p.width / 2, 0, p.width / 2, p.height);
                    p.noStroke();
                    p.fill("#213D46");
                    p.textAlign(p.CENTER, p.CENTER);
                    p.fill(255, 255, 255, 30);
                    if(usersData?.mode === "hidden") {
                        p.textSize(28);
                        p.text(`${leftScore} - ${rightScore}`, p.width / 2, 30);
                    }
                    else {
                        p.textSize(192);
                        p.text(leftScore, p.width / 4, p.height / 2);
                        p.text(rightScore, (p.width / 4) * 3, p.height / 2);
                    }
                    p.fill("#213D46");
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
                    if(gameResult === "You won")
                        p.fill('#00af50');
                    else
                        p.fill('#e55217');
                    if ((gameResult as string).endsWith('!')) {
                        p.fill('#00af50');
                        p.text(gameResult, p.width / 2, p.height / 2 - 25);
                        if(playerPos === 'left')
                            p.text("5 - 0", p.width / 2, p.height / 2 + 20);
                        else
                            p.text("0 - 5", p.width / 2, p.height / 2 + 20);
                    }
                    else {
                        p.text(gameResult, p.width / 2, p.height / 2 - 25);
                        if (gameResult === 'You lost' && playerPos === 'left')
                            p.text(`${leftScore} - ${rightScore + 1}`, p.width / 2, p.height / 2 + 20);
                        else if (gameResult === 'You lost' && playerPos === 'right')
                            p.text(`${leftScore + 1} - ${rightScore}`, p.width / 2, p.height / 2 + 20);
                        else if (gameResult === 'You won' && playerPos === 'left')
                            p.text(`${leftScore + 1} - ${rightScore}`, p.width / 2, p.height / 2 + 20);
                        else if (gameResult === 'You won' && playerPos === 'right')
                            p.text(`${leftScore} - ${rightScore + 1}`, p.width / 2, p.height / 2 + 20);
                    }
                }
                else {
                    p.background('#151515');
                    p.fill(255);
                    p.fill(255, 255, 255, 60);
                    p.textSize(34);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text("Waiting for another player", p.width / 2, p.height / 2);
                }
                if(liveGame && leftPaddle.x && rightPaddle.x) {
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
                    <p className='text-lg'>{usersData?.player1 && usersData.player1.name}</p>
                    <span className="text-xs">{usersData?.player1 && `lvl ${usersData.player1.level}`}</span>
                </div>
            </div>
            <div className='flex items-center'>
                <div className='flex flex-col items-center mr-4'>
                    <p className='text-lg'>{usersData?.player2 && usersData.player2.name}</p>
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
