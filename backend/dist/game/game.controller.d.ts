export declare class GameController {
    constructor();
    game(req: any): Promise<string>;
    updateGameState(gameState: any): Promise<{
        message: string;
    }>;
}
