import { Controller, Get, Body, Req, UnauthorizedException, Post, UseGuards,} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
// import { clearConfigCache } from 'prettier';

@Controller()
export class UsersController {
    constructor(private config: ConfigService,
        private jwt: JwtService,
        private userservice: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('home')
    async homepage(req) {
        return 'hello world'+ req.user.firstName;
    }

    @UseGuards(JwtAuthGuard)
    @Post('sendFriendRequest')
    async sendFriendRequest(@Body() body: any, @Req() req) {
        const friendrequest = await this.userservice.sendFriendRequest(req.user.id, req.body.friendId);
        return friendrequest;
    }
    
    @UseGuards(JwtAuthGuard)
    @Post('cancelFriendRequest')
    async cancelFriendRequest(@Body() body: any, @Req() req) {
        const friendrequest = await this.userservice.cancelFriendRequest(req.user.id, req.body.friendId);
        return friendrequest;
    }
        
    @UseGuards(JwtAuthGuard)
    @Post('acc')
    async acceptFrienRequest(@Body() body: any, @Req() req) {
        const friendrequest = await this.userservice.acceptFriendRequest(req.user.id, req.body.friendId); // mean
        return {friendrequest};
    }

    @UseGuards(JwtAuthGuard)
    @Post('rejecte')
    async rejectFrienRequest(@Body() body: any, @Req() req) {
        const friendrequest = await this.userservice.rejectFriendRequest(req.user.id, req.body.friendId);
        return friendrequest;
    }
}
