import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Controller('chat')
export class ChatController {
    constructor(private config: ConfigService,
        private jwt: JwtService,
        private userservice: ChatService) { }

    @UseGuards(JwtAuthGuard)
    @Post('joinRoom:roomId')
    async joinRoom(@Param('roomId') roomId: String, @Body() body: any, @Req() req) {
        
    }
}
