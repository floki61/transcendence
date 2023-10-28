export declare class GameService {
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
}
