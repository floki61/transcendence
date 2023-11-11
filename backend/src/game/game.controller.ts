import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards} from '@nestjs/common';
import { Server } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { UsersService } from 'src/users/users.service';
// 
@Controller()
export class GameController {
	constructor(private gameService: GameService,
				private userservice: UsersService,
				private gamegtw: GameGateway) {}
	@UseGuards(JwtAuthGuard)
    @Post('sendPlaydRequest')
    async sendPlayRequest(@Body() body: any, @Req() req) {
        if (req.user.id == req.body.friendId)
            throw new HttpException('You can\'t send play request to yourself', HttpStatus.BAD_REQUEST);
        if (!await this.userservice.checkFriendship(req.user.id, req.body.friendId))
            throw new HttpException('You are not friends', HttpStatus.BAD_REQUEST);
		// if (await this.gameService.checkingIfInGame(req.user.id)) {
		// 	throw new HttpException('You are in game', HttpStatus.BAD_REQUEST);
		// }
		// if (await this.gameService.checkingIfInGame(req.body.friendId)) {
		// 	throw new HttpException('Your friend is in game', HttpStatus.BAD_REQUEST);
		// }
        this.gamegtw.server.to(req.body.friendId).emit('PlayRequest', req.user.id);
		return { message: 'Play request sent successfully' };
    }
	@UseGuards(JwtAuthGuard)
	@Post('acceptPlayRequest')
	async acceptPlayRequest(@Body() body: any, @Req() req) {
		if (req.user.id == req.body.friendId)
			throw new HttpException('You can\'t accept play request from yourself', HttpStatus.BAD_REQUEST);
		if (!await this.userservice.checkFriendship(req.user.id, req.body.friendId))
			throw new HttpException('You are not friends', HttpStatus.BAD_REQUEST);
		// if (await this.gameService.checkingIfInGame(req.user.id)) {
		// 	throw new HttpException('You are in game', HttpStatus.BAD_REQUEST);
		// }
		// if (await this.gameService.checkingIfInGame(req.body.friendId)) {
		// 	throw new HttpException('Your friend is in game', HttpStatus.BAD_REQUEST);
		// }
		this.gamegtw.server.to(req.body.friendId).emit('PlayRequestAccepted', req.user.id);
		return { message: 'Play request accepted successfully' };
	}
	@UseGuards(JwtAuthGuard)
	@Post('rejectPlayRequest')
	async rejectPlayRequest(@Body() body: any, @Req() req) {
		if (req.user.id == req.body.friendId)
			throw new HttpException('You can\'t reject play request from yourself', HttpStatus.BAD_REQUEST);
		if (!await this.userservice.checkFriendship(req.user.id, req.body.friendId))
			throw new HttpException('You are not friends', HttpStatus.BAD_REQUEST);
		// if (await this.gameService.checkingIfInGame(req.user.id)) {
		// 	throw new HttpException('You are in game', HttpStatus.BAD_REQUEST);
		// }
		// if (await this.gameService.checkingIfInGame(req.body.friendId)) {
		// 	throw new HttpException('Your friend is in game', HttpStatus.BAD_REQUEST);
		// }
		this.gamegtw.server.to(req.body.friendId).emit('PlayRequestRejected', req.user.id);
		return { message: 'Play request rejected successfully' };
	}
}
