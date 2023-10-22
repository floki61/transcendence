"use client"
import React, { cloneElement, useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import { useGame } from '@/context/gameSocket';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { Cagliostro, Changa } from 'next/font/google';


let leftPaddle = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    speed: 0,
};
let rightPaddle = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    speed: 0,
};
let ball = {
    x: 0,
    y: 0,
    radius: 0,
    xSpeed: 0,
    ySpeed: 0,
    speed: 0,
};
let leftScore = 0, rightScore = 0;

const GamePage = () => {
    const p5Ref = useRef();
    const {socket} = useGame();
    const gameDataRef = useRef(null);
    const [count, setCount] = useState(false);
    const [gameResult, setGameResult] = useState(null);

    function initGame(p: p5) {
        leftPaddle.width = 10;
        leftPaddle.height = 100;
        leftPaddle.x = leftPaddle.width;
        leftPaddle.y = p.height / 2;
        leftPaddle.speed = 5;

        rightPaddle.width = 10;
        rightPaddle.height = 100;
        rightPaddle.x = p.width - rightPaddle.width;
        rightPaddle.y = p.height / 2;
        rightPaddle.speed = 5;

        ball.x = p.width / 2;
        ball.y = p.height / 2;
        ball.radius = 15;
        ball.speed = 5;
        ball.xSpeed =  ball.speed * Math.cos(Math.random() * (2 * Math.PI));
        ball.ySpeed =  ball.speed * Math.sin(Math.random() * (2 * Math.PI));
    }

    function updatePaddle(p: p5, event: string) {
        if (event === 'up') {
            if (leftPaddle.y > leftPaddle.height / 2)
                leftPaddle.y -= leftPaddle.speed;
        }
        else if (event === 'down') {
            if (leftPaddle.y < p.height - leftPaddle.height / 2)
                leftPaddle.y += leftPaddle.speed;
        }
    }
    function ballHitsPaddle(paddle: any) {
        return (
            ball.x - ball.radius < paddle.x + paddle.width / 2 &&
            ball.x + ball.radius > paddle.x - paddle.width / 2 &&
            ball.y + ball.radius > paddle.y - paddle.height / 2 &&
            ball.y - ball.radius < paddle.y + paddle.height / 2
            // ball.x - ball.radius > paddle.x - paddle.width / 2
        );
    }
    function map(value: number, start1: number, stop1: number, start2: number, stop2: number): number {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    }

    function radians(deg: number) {
        return (deg * Math.PI) / 180.0;
    };

    function updateBall(p: p5) {
         if (ball.y < 0 || ball.y > p.height - ball.radius)
            ball.ySpeed *= -1;
        else if (ball.x < 0 || ball.x > p.width){
            if(ball.x < 0)
                rightScore++;
            else
                leftScore++;
            ball.speed = 5;
            ball.xSpeed =  ball.speed * Math.cos(Math.random() * (2 * Math.PI));
            ball.ySpeed =  ball.speed * Math.sin(Math.random() * (2 * Math.PI));
            ball.x = p.width / 2;
            ball.y = p.height / 2;
        }
        else {
            if (ballHitsPaddle(leftPaddle)) {
                const diff = ball.y - (leftPaddle.y - leftPaddle.height / 2);
                const rad = radians(45);
                const angle = map(diff, 0, leftPaddle.height, -rad, rad);
                ball.speed += 0.5;
                ball.xSpeed = ball.speed * Math.cos(angle);
                ball.ySpeed = ball.speed * Math.sin(angle);
                ball.x = leftPaddle.x + leftPaddle.width / 2 + ball.radius; 
            }
            if(ballHitsPaddle(rightPaddle)) {
                const diff = ball.y - (rightPaddle.y - rightPaddle.height / 2);
                const angle = map(diff, 0, rightPaddle.height, radians(225), radians(135));
                ball.speed += 0.5;
                ball.xSpeed = ball.speed * Math.cos(angle);
                ball.ySpeed = ball.speed * Math.sin(angle);
                ball.x = rightPaddle.x - rightPaddle.width / 2 - ball.radius;
            }
        }
        ball.x += ball.xSpeed ;
        ball.y += ball.ySpeed ;
        console.log(ball.xSpeed, ball.ySpeed);
    }

    function moveRightPaddle(p: p5) {
        if(ball.xSpeed < 0 || ball.x < p.width / 2)
            return ;
        if(rightPaddle.y > ball.y && rightPaddle.y - rightPaddle.height / 2 > ball.y && rightPaddle.y > rightPaddle.height / 2)
            rightPaddle.y -= rightPaddle.speed;
        else if(rightPaddle.y < ball.y && rightPaddle.y + rightPaddle.height / 2 < ball.y && rightPaddle.y < p.height - rightPaddle.height / 2)
            rightPaddle.y += rightPaddle.speed;
    }


    useEffect(() => {
        let canvas: any;
        const sketch = (p: p5) => {
            p.setup = () => {
                canvas = p.createCanvas(p.windowWidth / 2, p.windowHeight / 2);
                canvas.position((p.windowWidth - canvas.width) / 2, (p.windowHeight - canvas.height) / 2);
                p.background("#223d46");
                initGame(p);
            };    
            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth / 2, p.windowHeight / 2);
                centerCanvas();
            };

            const centerCanvas = () => {
                canvas.position((p.windowWidth - p.width) / 2, (p.windowHeight - p.height) / 2);
            };
            p.draw = () => {
                p.background("#223d46");
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
