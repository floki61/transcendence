import { Controller, Get, Body, Req, UnauthorizedException, Post,} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from './users.service';
// import { clearConfigCache } from 'prettier';

@Controller()
export class UsersController {
    constructor(private config: ConfigService,
        private jwt: JwtService,
        private userservice: UsersService) { }
    @Get('home')
    async homepage(req: Request) {
        return this.userservice.checkjwt(req.cookies['access_token']);
    }
    @Post('sendFriendRequest')
    async sendFriendRequest(@Body() body: any, @Req() req: Request) {
        const payload = await this.jwt.verifyAsync(
            req.cookies['access_token'],
            {
                secret: this.config.get('secret')
            }
        );
        const user = await this.userservice.getuser(payload.id);
        const friendrequest = await this.userservice.sendFriendRequest(user.id, body.friendId);
        return friendrequest;
    }

    @Post('cancelFriendRequest')
    async cancelFriendRequest(@Body() body: any, @Req() req: Request) {
        const payload = await this.jwt.verifyAsync(
            req.cookies['access_token'],
            {
                secret: this.config.get('secret')
            }
        );
        const user = await this.userservice.getuser(payload.id);
        const friendrequest = await this.userservice.cancelFriendRequest(user.id, body.friendId);
        return friendrequest;
    }

    @Post('acc')
    async acceptFrienRequest(@Body() body: any, @Req() req: Request) {
        const payload = await this.jwt.verifyAsync(
            req.cookies['access_token'],
            {
                secret: this.config.get('secret')
            });
        // console.log({ body, payload });
        const user = await this.userservice.getuser(payload.id);

        // console.log({ user });

        const friendrequest = await this.userservice.acceptFriendRequest(user.id, body.friendId); // mean
        return friendrequest;
    }

    @Post('rejecte')
    async rejectFrienRequest(@Body() body: any, @Req() req: Request) {
        const payload = await this.jwt.verifyAsync(
            req.cookies['access_token'],
            {
                secret: this.config.get('secret')
            });
        // console.log({ body, payload });
        const user = await this.userservice.getuser(payload.id);

        // console.log({ user });

        const friendrequest = await this.userservice.rejectFriendRequest(user.id, body.friendId); // mean
        return friendrequest;
    }
}
