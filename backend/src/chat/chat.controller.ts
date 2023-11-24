import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ChatGateway } from './chat.gateway';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/decorators/roles.guard';
import { PrismaService } from 'src/prisma/prisma.service';


@Controller('chat')
export class ChatController {
    constructor(private config: ConfigService,
        private jwt: JwtService,
        private userservice: ChatService,
        private chatgtw: ChatGateway,
        private prisma: PrismaService) { }

    // body: { friendId: string, roomId: string }
    @UseGuards(JwtAuthGuard)
    @Post('createRoom')
    async createRoom(@Body() body: any, @Req() req: any) {
        // console.log("hello");
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
        console.log(user);
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

    // @Roles('ADMIN', 'OWNER', 'USER')
    @UseGuards(JwtAuthGuard)
    @Get('getAllRooms')
    async getAllRoom(@Req() req: any) {
        const rooms = await this.userservice.getAllRoom(req.user.id);
        return rooms;
    }

    @UseGuards(JwtAuthGuard)
    @Post('getMessages')
    async getMessages(@Body() body: any, @Req() req: any) {
        // messages are not in order in case of user kicked of the room and went back
        const messages = await this.userservice.getMessages(body);
        return messages;
    }

    @UseGuards(JwtAuthGuard)
    @Post('leaveRoom')
    async leaveRoom(@Body() body: any, @Req() req: any) {
        const room = await this.userservice.leaveRoom(body);
        return room;
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

    // @Roles('OWNER', 'ADMIN', 'USER')
    @UseGuards(JwtAuthGuard)
    @Get('myRooms')
    async getMyRooms(@Req() req: any) {
        const rooms = await this.userservice.getMyRooms({ id: req.user.id });
        for (var room of rooms) {
            if (room.is_DM) {
                room.picture = await this.userservice.getUserPicture(req.user.id === room.participants[0].uid ? room.participants[1].uid : room.participants[0].uid);
            }
            delete room.participants;
        }
        return rooms;
    }

    @Roles('OWNER', 'ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('addParticipant')
    async addParticipant(@Body() body: any, @Req() req: any) {
        // console.log('hahowa');
        const room = await this.userservice.addParticipant(body);
        return room;
    }

    @UseGuards(JwtAuthGuard)
    @Post('getParticipants')
    async getParticipant(@Body() body: any, @Req() req: any) {
        // console.log('hahowa');
        const room = await this.userservice.getParticipant(body, req.user.id);
        return room;
    }

    @Roles('OWNER', 'ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('getRoomById')
    async getRoomById(@Body() body: any, @Req() req: any) {
        console.log('hahowa');
        const room = await this.userservice.getRoomById(body);
        return room;
    }

    @UseGuards(JwtAuthGuard)
    @Post('participantNotInRoom')
    async participantNotInRoom(@Body() body: any, @Req() req: any) {
        // console.log('hahowa');
        const room = await this.userservice.participantNotInRoom(body);
        return room;
    }

    @Roles('OWNER', 'ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('getBannedUsers')
    async getBannedUsers(@Body() body: any, @Req() req: any) {
        const room = await this.userservice.getBannedUsers(body);
        return room;
    }


    // @UseGuards(JwtAuthGuard)
    // @Get('AllRooms')
    // async getAllRooms(@Req() req: any) {
    //     const rooms = await this.userservice.getAllRooms();
    //     // for (var room of rooms) {
    //     //     if (room.is_DM) {
    //     //         room.picture = await this.userservice.getUserPicture(req.user.id === room.participants[0].uid ? room.participants[1].uid : room.participants[0].uid);
    //     //     }
    //     //     delete room.participants;
    //     // }
    //     return rooms;
    // }
}
