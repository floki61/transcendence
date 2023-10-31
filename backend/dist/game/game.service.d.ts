import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class GameService {
    private eventEmitter;
    constructor(eventEmitter: EventEmitter2);
    private initialGameData;
    private deepCopy;
    gameData: any;
    resetGame(): any;
    resetScore(): void;
    updatePaddle(event: string, targetPaddle: string): Promise<any>;
    private map;
    private ballHitsPaddle;
    private radians;
    moveBall(): Promise<any>;
    moveBot(): Promise<void>;
    Quee(id: any): Promise<void>;
    Botgame(id: any): Promise<void>;
}
