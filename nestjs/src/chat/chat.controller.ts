import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/decorators/roles.guard';
import { Roles } from 'src/decorators/role.decorator';
import { ChatGateway } from './chat.gateway';


@Controller('chat')
export class ChatController {
    constructor(private config: ConfigService,
        private jwt: JwtService,
        private userservice: ChatService,
        private chatgtw: ChatGateway) { }

    // body: { friendId: string, roomId: string }
    @UseGuards(JwtAuthGuard)
    @Post('createRoom')
    async createRoom(@Body() body: any, @Req() req: any) {
        const user = await this.userservice.createRoom(body);
        return user;
    }

    //map problems
    @UseGuards(JwtAuthGuard)
    @Post('joinRoom')
    async joinRoom(@Body() body: any, @Req() req: any) {
        const user = await this.userservice.joinRoom(body);
        return user;
    }

    @Roles('ADMIN', 'OWNER')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('banUser')
    async banUser(@Body() body: any, @Req() req: any) {
        const user = await this.userservice.banUser(body);
        return user;
    }
    
    @Roles('ADMIN', 'OWNER')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('unbanUser')
    async unbanUser(@Body() body: any, @Req() req: any) {
        const user = await this.userservice.unbanUser(body);
        return user;
    }
    
    @Roles('ADMIN', 'OWNER')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('kickUser')
    async kickUser(@Body() body: any, @Req() req: any) {
        const user = await this.userservice.kickUser(body);
        return user;
    }
    
    @Roles('ADMIN', 'OWNER', 'USER')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('getAllRooms')
    async getAllRoom(@Body() body: any, @Req() req: any) {
        const rooms = await this.userservice.getAllRoom();
        // console.log({ rooms });
        return rooms;
    }
    
    @UseGuards(JwtAuthGuard)
    @Post('getMessages')
    async getMessages(@Body() body: any, @Req() req: any) {
        const messages = await this.userservice.getMessages(body);
        return messages;
    }
    
    /////////////////////////////
    @Roles('OWNER')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('deleteRoom')
    async deleteRoom(@Body() body: any, @Req() req: any) {
        const room = await this.userservice.deleteRoom(body);
        return room;
    }

    @Roles('OWNER')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('changeVisibility')
    async changeVisibility(@Body() body: any, @Req() req: any) {
        const room = await this.userservice.changeVisibility(body);
        return room;
    }
    
    @Roles('OWNER')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('changeRoomName')
    async changeRoomName(@Body() body: any, @Req() req: any) {
        const room = await this.userservice.changeRoomName(body);
        return room;
    }

    @Roles('OWNER', 'ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('muteUser')
    async muteUser(@Body() body: any, @Req() req: any) {
        const room = await this.userservice.muteUser(body);
        return room;
    }

    @Roles('OWNER', 'ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('unmuteUser')
    async unmuteUser(@Body() body: any, @Req() req: any) {
        const room = await this.userservice.unmuteUser(body);
        return room;
    }

    @Roles('OWNER')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('changePassword')
    async changePassword(@Body() body: any, @Req() req: any) {
        const room = await this.userservice.changePassword(body);
        return room;
    }

    @Roles('OWNER')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('giveAdmin')
    async giveAdmin(@Body() body: any, @Req() req: any) {
        const room = await this.userservice.giveAdmin(body);
        return room;
    }
}
