import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class GameService {
    private eventEmitter;
    constructor(eventEmitter: EventEmitter2);
    private initialGameData;
    private deepCopy;
    gameData: any;
    getGameData(): any;
    resetBall(data: any): void;
    resetScore(): void;
    updatePaddles(event: string, data: any, targetPaddle: boolean): Promise<void>;
    updateBotPaddle(event: string, data: any): Promise<void>;
    private map;
    private ballHitsPaddle;
    private radians;
    moveBall(data: any): Promise<string>;
    moveBot(data: any): Promise<void>;
}
