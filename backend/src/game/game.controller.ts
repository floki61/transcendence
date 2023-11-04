import { Body, Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import { Server } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
// 
@Controller()
export class GameController {
	constructor(private gameService: GameService) {}
	// @UseGuards(JwtAuthGuard)
	// @Get('/Quee')
	// async Quee(@Req() req) {
	// 	this.gameService.Quee(req.user.id);
	// }

	// @UseGuards(JwtAuthGuard)
	// @Get('/Botgame')
	// async Botgame(@Req() req) {
	// 	this.gameService.Botgame(req.user.id);
	// }
	// @Post('updateGameState')
	// async updateGameState(@Body() gameState: any) {
	// 	const io = new Server({
	// 		cors: {
	// 		  origin: "http://localhost:3000"
	// 		}
	// 	  });
		  
	// 	  io.listen(3001);
	//   console.log('Received game state:', gameState);	
	//   return { message: 'Game state received successfully' };
//   }
}
