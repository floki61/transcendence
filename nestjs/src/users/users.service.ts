import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class UsersService {
    constructor(private jwt: JwtService,
        private config: ConfigService,
        private prisma: PrismaService) { }
    async checkjwt(token: string) {
        try {
            const payload = await this.jwt.verifyAsync(
                token,
                {
                    secret: this.config.get('secret')
                }
            );
            console.log({ payload });
            const user = (await this.getuser(parseInt(payload.sub)));
            return 'Welcome ' + user.firstName + ' ' + user.lastName;
        }
        catch (e) {
            console.log(e);
            throw new UnauthorizedException();
        }
    }
    async getuser(id: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
        return user;
    }
    async sendFriendRequest(userId: number, friendId: number) {
        // console.log({ userId, friendId });
        const friendrequest = await this.prisma.friendShip.create({
            data: {
                userId,
                friendId,
            }
        });
        return friendrequest;
    }
    async acceptFriendRequest(userId: number, friendId: number) {
        const friendrequest = await this.prisma.friendShip.update({
            where: {
                userId_friendId: {
                    userId: friendId,
                    friendId: userId,
                }
            },
            data: {
                status: 'ACCEPTED'
            }
        });
        // const chatRoom = await this.prisma.chatRoom.create({
        //     data: {
        //         id: friendrequest.id,
        //         name: 'Chat between ' + userId + ' and ' + friendId,
        //         participants: {
        //             connect: [
        //                 { uid: userId },
        //                 { uid: friendId },
        //             ]
        //         }
        //     }
        // });
        // return { friendrequest, chatRoom };

    }

}