import { Controller, Get, Body, Req, UnauthorizedException, Post, UseGuards, UseInterceptors, UploadedFiles, UploadedFile, ParseFilePipeBuilder, HttpStatus, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, HttpException, Delete, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { max } from 'class-validator';
import { UsersGateway } from './users.gateway';
import { get } from 'http';
// import { clearConfigCache } from 'prettier';

@Controller()
export class UsersController {
    constructor(private config: ConfigService,
        private jwt: JwtService,
        private userservice: UsersService,
        private usergtw: UsersGateway,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    async home(@Req() req) {
        return ({ user: req.user, cookies: req.cookies });
    }

    @UseGuards(JwtAuthGuard)
    @Get('getUser')
    async getUser(@Req() req) {
        return (req.user);
    }

    @Post('getUserNameWithId')
    @UseGuards(JwtAuthGuard)
    async getUserNameWithId(@Req() req, @Body() body: any) {
        return this.userservice.getUserNameWithId(body.id);
    }

    @Post('getPictureWithId')
    @UseGuards(JwtAuthGuard)
    async getPictureWithId(@Req() req, @Body() body: any) {
        return this.userservice.getPictureWithId(body.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('userSettings')
    userSettings(@Req() req, @Body() data) {
        console.log(data);
        return this.userservice.updateUser(req, data);
    }

    @UseGuards(JwtAuthGuard)
    @Post('sendFriendRequest')
    async sendFriendRequest(@Body() body: any, @Req() req) {
        if (req.user.id == req.body.friendId)
            throw new HttpException('You can\'t send friend request to yourself', HttpStatus.BAD_REQUEST);
        if (await this.userservice.checkFriendship(req.user.id, req.body.friendId))
            throw new HttpException('You are already friends', HttpStatus.BAD_REQUEST);
        const friendrequest = await this.userservice.sendFriendRequest(req.user.id, req.body.friendId);
        this.usergtw.server.to(req.body.friendId).emit('friendRequest', friendrequest);
        return friendrequest;
    }

    @UseGuards(JwtAuthGuard)
    @Post('cancelFriendRequest')
    async cancelFriendRequest(@Body() body: any, @Req() req) {
        if (await this.userservice.checkFriendship(req.user.id, req.body.friendId))
            throw new HttpException('You are already friends', HttpStatus.BAD_REQUEST);
        const friendrequest = await this.userservice.cancelFriendRequest(req.user.id, req.body.friendId);

        return friendrequest;
    }

    @UseGuards(JwtAuthGuard)
    @Post('acc')
    async acceptFrienRequest(@Body() body: any, @Req() req) {
        const friendrequest = await this.userservice.acceptFriendRequest(req.user.id, req.body.friendId); // mean
        return { friendrequest };
    }

    @UseGuards(JwtAuthGuard)
    @Post('rejecte')
    async rejectFrienRequest(@Body() body: any, @Req() req) {
        const friendrequest = await this.userservice.rejectFriendRequest(req.user.id, req.body.friendId);
        return friendrequest;
    }

    @UseGuards(JwtAuthGuard)
    @Delete('unfriend')
    async unfriend(@Body() body: any, @Req() req) {
        console.log('unfriend', req.body.friendId, req.user.id);
        const friendrequest = await this.userservice.unfriend(req.user.id, req.body.friendId);
        return friendrequest;
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('avatar', {
        limits: {
            fileSize: 1024 * 1024,
        },
        storage: diskStorage({
            destination: './uploads',
            filename: (req: any, avatar, cb) => {
                console.log("salam khoi")
                const Name = req.user.id;
                if (extname(avatar.originalname) !== '.png' && extname(avatar.originalname) !== '.jpg' && extname(avatar.originalname) !== '.jpeg' && extname(avatar.originalname) !== '.gif') {
                    return cb(new HttpException('Only images are allowed', HttpStatus.BAD_REQUEST), '')
                }
                return cb(null, `${Name}${extname(avatar.originalname)}`);
            }
        })
    }))
    async uploadFile(@UploadedFile(
    ) file: Express.Multer.File, @Req() req) {
        return file;
    }

    @UseGuards(JwtAuthGuard)
    @Post('blockUser')
    async blockUser(@Body() body: any, @Req() req) {
        const user = await this.userservice.blockUser(req.user.id, req.body.friendId);
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Post('unblockUser')
    async unblockUser(@Body() body: any, @Req() req) {
        const user = await this.userservice.unblockUser(req.user.id, req.body.friendId);
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Delete('deleteAccount')
    async deleteAccount(@Req() req) {
        const user = await this.userservice.deleteAccount(req.user.id);
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('getFriends')
    async getFriends(@Req() req) {
        const friends = await this.userservice.getFriends(req.user.id);
        return friends;
    }

    @UseGuards(JwtAuthGuard)
    @Get('getFriendRequests')
    async getFriendRequests(@Req() req) {
        const friendrequests = await this.userservice.getFriendRequests(req.user.id);
        return friendrequests;
    }

    @UseGuards(JwtAuthGuard)
    @Post('getFriendProfile')
    async getFriendProfile(@Req() req, @Body() body: any) {
        const friend = await this.userservice.getFriendProfile(body.id);
        console.log('friend', friend);
        return friend;
    }

    @UseGuards(JwtAuthGuard)
    @Post('getFriendProfileWithUserName')
    async getFriendProfileWithUserName(@Req() req, @Body() body: any) {
        const friend = await this.userservice.getFriendProfileWithUserName(body.userName);
        console.log('friend', friend);
        return friend;
    }

    @UseGuards(JwtAuthGuard)
    @Get('getAllUsers')
    async getAllUsers(@Req() req: any) {
        const users = await this.userservice.getAllUsers();
        return users;
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async profile(@Req() req) {
        const user = await this.userservice.getProfile(req.user.id);
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Post('getStats')
    async getStats(@Req() req, @Body() body: any) {
        const stats = await this.userservice.getStats(body);
        console.log({stats});
        return stats;
    }

    @UseGuards(JwtAuthGuard)
    @Post('getAchievements')
    async getAchievements(@Req() req, @Body() body: any) {
        const achievements = await this.userservice.getAchievements(body.id);
        return achievements;
    }
}
