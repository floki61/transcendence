"use client"
import React, { cloneElement, useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import { useGame } from '@/context/gameSocket';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { Cagliostro, Changa } from 'next/font/google';
import { initGame, updatePaddle, updateBall, moveRightPaddle, leftPaddle, rightPaddle, ball, leftScore, rightScore, resizeGameData } from '@/gameLogic/gameLogic';



const GamePage = () => {
    const p5Ref = useRef();
    const {socket} = useGame();
    const gameDataRef = useRef(null);
    const [count, setCount] = useState(true);
    const [gameResult, setGameResult] = useState(null);
    let canvasWidth = window.innerWidth * 0.5; // Set canvas width as 50% of the screen width
    let canvasHeight = window.innerHeight * 0.5; // Set canvas height as 50% of the screen height

    useEffect(() => {
        let canvas: any;
        const sketch = (p: p5) => {
            p.setup = () => {
                canvas = p.createCanvas(canvasWidth, canvasHeight);
                // canvas = p.createCanvas(p.windowWidth / 2, p.windowHeight / 2);
                canvas.position((p.windowWidth - canvas.width) / 2, (p.windowHeight - canvas.height) / 2);
                p.background('#151515'); 
                canvas.addClass("border-4 rounded-md bg-gray-800");
                canvas.style('border-color', '#213e46'); 
                initGame(p);
            };    
            p.windowResized = () => {
                canvasWidth = window.innerWidth * 0.5;
                canvasHeight = window.innerHeight * 0.5;
                resizeGameData(p, canvasWidth, canvasHeight);
                p.resizeCanvas(canvasWidth, canvasHeight);
                centerCanvas();
            };

            const centerCanvas = () => {
                canvas.position((p.windowWidth - p.width) / 2, (p.windowHeight - p.height) / 2);
            };
            p.draw = () => {
                if(count) {
                    p.background("#151515");
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
                    updateBall(p);
                    moveRightPaddle(p);
                    if (p.keyIsDown(p.UP_ARROW))
                        updatePaddle(p, "up");
                    else if(p.keyIsDown(p.DOWN_ARROW))
                        updatePaddle(p, "down");
                }
                if(leftScore == 5 || rightScore == 5){
                    p.background("#151515");
                    p.fill(255);
                    p.textSize(34);
                    p.textAlign(p.CENTER, p.CENTER);
                    if(leftScore == 5)
                        p.text("WAAA3R", canvasWidth / 2, canvasHeight / 2);
                    else
                        p.text("D3iiif", canvasWidth / 2, canvasHeight / 2);
                    // p.text("D3iiiF", p.width / 2, p.height / 2);
                    setCount(false);
                }
            };
        };
        const mp5 = new p5(sketch, p5Ref.current);
        return mp5.remove;
        }),[];

        return (
        <div >
            {/* Render the canvas here */}
        </div>
    );
};
export default GamePage;
