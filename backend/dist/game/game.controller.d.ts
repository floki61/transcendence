import { GameService } from './game.service';
export declare class GameController {
    private gameService;
    constructor(gameService: GameService);
    Quee(req: any): Promise<void>;
    Botgame(req: any): Promise<void>;
}
