import { Body, Controller, Get, Post, Req, Res} from '@nestjs/common';
import { Server } from 'socket.io';
// 
@Controller()
export class GameController {
	constructor() {}
	// @Get('/waitingforplayers')
	// async game(@Req() req) {
    //     return "hey";
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
