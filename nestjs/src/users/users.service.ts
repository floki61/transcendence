import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { MESSAGES } from '@nestjs/core/constants';
import { JwtService } from '@nestjs/jwt';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class UsersService {
    constructor(private jwt: JwtService,
        private config: ConfigService,
        private prisma: PrismaService) {}

    async getUser(idu: string) {
        return await this.prisma.user.findUnique({
            where: {
                id: idu,
            },
        });
    }

    async createUser(req) {
        return await this.prisma.user.create({
            data:
            {
                id: req.user.id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                picture: req.user.picture
            },
        });
    }

	async sendFriendRequest(userId: string, friendId: string) {
		console.log({ userId, friendId });
		const friendrequest = await this.prisma.friendShip.create({
			data: {
				userId,
				friendId,
			}
		});
		return friendrequest;
	}

	async cancelFriendRequest(userId: string, friendId: string) {
		// console.log({ userId, friendId });
		const friendrequest = await this.prisma.friendShip.delete({
			where: {
				userId_friendId: {
					userId,
					friendId,
				}
			}
		});
		return friendrequest;
	}

	async acceptFriendRequest(userId: string, friendId: string) {
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
		if (await this.prisma.chatRoom.findFirst({
			where: {
				AND: [
						{
							participants: {
								some: {
									uid: {
									  in: [userId, friendId],
									},
								},
							},
						},
						{
							is_DM: true
						},
					],
			}
		}))
		{
			return { friendrequest };
		}
		const chatRoom = this.creatChatRoom(userId, friendId);
		return { friendrequest, chatRoom };
	}

	async   creatChatRoom(userId: string, friendId: string) {
		const chatRoom = await this.prisma.chatRoom.create({
			data: {
				name: 'Chat between ' + (await this.prisma.user.findUnique({where: {id: userId}})).firstName 
				+ ' and ' + (await this.prisma.user.findUnique({where: {id: friendId}})).firstName,
			}
		});
		const participant1 = await this.prisma.participant.create({
			data: {
				uid: userId,
				rid: chatRoom.id,
			}
		});
		const participant2 = await this.prisma.participant.create({
			data: {
				uid: friendId,
				rid: chatRoom.id,
			}
		});
		// console.log({ userId, friendId });
		return chatRoom;
	}

	async rejectFriendRequest(userId: string, friendId: string) {
		const friendrequest = await this.prisma.friendShip.update({
			where: {
				userId_friendId: {
					userId: friendId,
					friendId: userId,
				}
			},
			data: {
				status: 'REJECTED'
			}
		});
	}

	async unfriend(userId: string, friendId: string) {
		const friendrequest = this.prisma.friendShip.findFirst({
			where: {
				OR: [
					{
						userId,
						friendId,
					},
					{
						userId: friendId,
						friendId: userId,
					},
				],
			},
		})
		await this.prisma.friendShip.delete({
			where: {
				id : (await friendrequest).id,
			}
		})
		
	}

	async checkFriendship(userId: string, friendId: string) {
		const friendrequest = await this.prisma.friendShip.findFirst({
			where: {
				OR: [
					{
						userId,
						friendId,
					},
					{
						userId: friendId,
						friendId: userId,
					},
				],
			},
		})
		if (friendrequest)
			return true;
		return false;
	}
}