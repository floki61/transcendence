import { Controller, Get, Body, Req, UnauthorizedException, Post, UseGuards, UseInterceptors, UploadedFiles, UploadedFile, ParseFilePipeBuilder, HttpStatus, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, HttpException,} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { max } from 'class-validator';
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

    @UseGuards(JwtAuthGuard)
    @Post('unfriend')
    async unfriend(@Body() body: any, @Req() req) {
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

    
}
