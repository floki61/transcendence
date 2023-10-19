export declare class GameService {
    private initialGameData;
    score: {
        left: number;
        right: number;
    };
    private deepCopy;
    gameData: any;
    resetGame(): any;
    resetScore(): void;
    updatePaddle(event: string, targetPaddle: string): Promise<any>;
    private map;
    private ballHitsPaddle;
    private radians;
    moveBall(): Promise<any>;
}
