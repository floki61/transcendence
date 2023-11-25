import p5 from "p5";

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
    pos: 0,
};
let leftScore = 0, rightScore = 0;
let gameState = false;
let gameResult = "";



//live game 
function updatePaddles(p: p5, data: any) {
    leftPaddle.x = (data.leftPaddle.x * (p.windowWidth / 2)) / data.canvasWidth;
    leftPaddle.y = (data.leftPaddle.y * (p.windowHeight / 2)) / data.canvasHeight;    
    leftPaddle.width = (data.leftPaddle.width / data.canvasWidth) * p.width;
    leftPaddle.height = (data.leftPaddle.height / data.canvasHeight) * p.height;

    rightPaddle.x = (data.rightPaddle.x / data.canvasWidth) * p.width;
    rightPaddle.y = (data.rightPaddle.y / data.canvasHeight) * p.height;                
    rightPaddle.width = (data.rightPaddle.width / data.canvasWidth) * p.width;
    rightPaddle.height = (data.rightPaddle.height / data.canvasHeight) * p.height;

}
function updateBallData(p: p5, data: any) {
    if(data.ball) {
        ball.x  = (data.ball.x * (p.windowWidth / 2)) / data.canvasWidth;
        ball.y  = (data.ball.y * (p.windowHeight / 2)) / data.canvasHeight;
        ball.radius  = (data.ball.radius * (p.windowHeight / 2)) / data.canvasHeight;
        ball.pos = data.ball.pos;
    }
}

function updateScore(data: any) {
    leftScore = data.score.left;
    rightScore = data.score.right;
}

function finishGame() {
    gameState = true;
}
function initResult() {
    gameState = false;
    gameResult = "";
}
 function setGameResult(data: any) {
    gameResult = data;
 }
//bot game
// function initGame(p: p5) {
//     leftPaddle.width = 10;
//     leftPaddle.height = 100;
//     leftPaddle.x = leftPaddle.width;
//     leftPaddle.y = p.height / 2;
//     leftPaddle.speed = 10;

//     rightPaddle.width = 10;
//     rightPaddle.height = 100;
//     rightPaddle.x = p.width - rightPaddle.width;
//     rightPaddle.y = p.height / 2;
//     rightPaddle.speed = 5;

//     ball.x = p.width / 2;
//     ball.y = p.height / 2;
//     ball.radius = 15;
//     ball.speed = 5;
//     ball.xSpeed =  ball.speed * Math.cos(Math.random() * (2 * Math.PI));
//     ball.ySpeed =  ball.speed * Math.sin(Math.random() * (2 * Math.PI));
// }

function initGame(p: p5) {
    leftPaddle.width = p.width * 0.01;
    leftPaddle.height = p.height * 0.2;
    leftPaddle.x = p.width * 0.02;
    leftPaddle.y = p.height / 2;
    leftPaddle.speed = 10;

    rightPaddle.width = p.width * 0.01;
    rightPaddle.height = p.height * 0.2;
    rightPaddle.x = p.width - rightPaddle.width * 2;
    rightPaddle.y = p.height / 2;
    rightPaddle.speed = 5;

    ball.x = p.width / 2;
    ball.y = p.height / 2; 
    ball.radius = Math.min(p.width, p.height) * 0.03;
    ball.speed = 5;
    ball.xSpeed = ball.speed * Math.cos(Math.random() * (2 * Math.PI));
    ball.ySpeed = ball.speed * Math.sin(Math.random() * (2 * Math.PI));
}

// function resizeGameData(p: p5, canvasWidth: number, canvasHeight: number) {
//     leftPaddle.x = (leftPaddle.x * canvasWidth) / p.width;
//     leftPaddle.y = (leftPaddle.y * canvasHeight) / p.height;
//     // leftPaddle.width = (leftPaddle.width * canvasWidth) / p.width;
//     // leftPaddle.height = (leftPaddle.height * canvasHeight) / p.height;

//     rightPaddle.x = (rightPaddle.x * canvasWidth) / p.width;
//     rightPaddle.y = (rightPaddle.y * canvasHeight) / p.height;
//     rightPaddle.width = (rightPaddle.width * canvasWidth) / p.width;
//     rightPaddle.height = (rightPaddle.height * canvasHeight) / p.height;

//     // ball.x = (ball.x * canvasWidth) / p.width;
//     // ball.y = (ball.y * canvasHeight) / p.height;
//     // ball.radius = (ball.radius * Math.min(canvasWidth, canvasHeight)) / p.width;
// }
function resizeGameData(p: p5, canvasWidth: number, canvasHeight: number) {
    leftPaddle.x = (leftPaddle.x / p.width) * canvasWidth;
    leftPaddle.y = (leftPaddle.y / p.height) * canvasHeight;
    leftPaddle.width = (leftPaddle.width / p.width) * canvasWidth;
    leftPaddle.height = (leftPaddle.height / p.height) * canvasHeight;

    rightPaddle.x = (rightPaddle.x / p.width) * canvasWidth;
    rightPaddle.y = (rightPaddle.y / p.height) * canvasHeight;
    rightPaddle.width = (rightPaddle.width / p.width) * canvasWidth;
    rightPaddle.height = (rightPaddle.height / p.height) * canvasHeight;

    ball.x = (ball.x / p.width) * canvasWidth;
    ball.y = (ball.y / p.height) * canvasHeight;
    ball.radius = (ball.radius / p.width) * canvasWidth;
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
//    console.log(ball.xSpeed, ball.ySpeed);
}

function moveRightPaddle(p: p5) {
    if(ball.xSpeed < 0 || ball.x < p.width / 2)
        return ;
    if(rightPaddle.y > ball.y && rightPaddle.y - rightPaddle.height / 2 > ball.y && rightPaddle.y > rightPaddle.height / 2)
        rightPaddle.y -= rightPaddle.speed;
    else if(rightPaddle.y < ball.y && rightPaddle.y + rightPaddle.height / 2 < ball.y && rightPaddle.y < p.height - rightPaddle.height / 2)
        rightPaddle.y += rightPaddle.speed;
}

export { initGame, updatePaddle, updateBall, moveRightPaddle, leftPaddle, rightPaddle, ball, leftScore, rightScore, updatePaddles, updateBallData, updateScore, resizeGameData, finishGame, gameState, gameResult, setGameResult, initResult};