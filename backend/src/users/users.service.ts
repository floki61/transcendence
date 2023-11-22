import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
// import { MESSAGES } from '@nestjs/core/constants';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from 'src/chat/chat.service';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class UsersService {
	constructor(private jwt: JwtService,
		private config: ConfigService,
		private prisma: PrismaService,
		private event: EventEmitter2,
	) { }

	async getUser(idu: string) {
		return await this.prisma.user.findUnique({
			where: {
				id: idu,
			},
		});
	}

	async checkIfnameExists(username: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				userName: username,
			},
		});
		// console.log(user, 'hhhhh');
		return user ? true : false;
	}
	async updateUser(req, data: any) {
		if (data.userName)
			this.updateUserName(req, data.userName);
		if (data.phoneNumber)
			this.updateUserPhoneNumber(req, data);
		if (data.country)
			this.updateUserCountry(req, data);
		return await this.prisma.user.update({
			where: {
				id: req.user.id,
			},
			data: {
				picture: data.picture,
			},
		});
	}

	async updateUserPicture(req, data: any) {
		return await this.prisma.user.update({
			where: {
				id: req.user.id,
			},
			data: {
				picture: data.picture,
			},
		});
	}
	async updateUserName(req, data: any) {
		if (await this.checkIfnameExists(data))
			return "Username already exists";

		return await this.prisma.user.update({
			where: {
				id: req.user.id,
			},
			data: {
				userName: data,
			},
		});
	}

	async updateUserPhoneNumber(req, data: any) {
		return await this.prisma.user.update({
			where: {
				id: req.user.id,
			},
			data: {
				phoneNumber: data.phoneNumber,
			},
		});
	}

	async updateUserCountry(req, data: any) {
		return await this.prisma.user.update({
			where: {
				id: req.user.id,
			},
			data: {
				country: data.country,
			},
		});
	}

	async createUser(req) {
		return await this.prisma.user.create({
			data:
			{
				userName: req.user.login,
				id: req.user.id,
				firstName: req.user.firstName,
				lastName: req.user.lastName,
				email: req.user.email,
				picture: req.user.picture
			},
		});
	}

	async getUserNameWithId(id: string) {
		// console.log("hahowa", id);
		if (!id)
			return null;
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			},
		});
		if (user)
			return user.userName;
		return null;
	}

	async getPictureWithId(id: string) {
		if (!id)
			return null;
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			},
		});
		if (user)
			return user.picture;
		return null;
	}

	async getLevelWithId(id: string) {
		if (!id)
			return null;
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			},
		});
		if (user) {
			const level = await this.getLevelP(user.level);
			console.log(level);
			return level.level_P;
		}
		return null;
	}

	async sendPlayRequest(userId: string, friendId: string) {
		console.log({ userId, friendId });
		const user = await this.prisma.user.findFirst({
			where: {
				id: userId,
			}
		});
		return { user };
	}

	async sendFriendRequest(userId: string, friendId: string) {
		const friendrequest = await this.prisma.friendShip.create({
			data: {
				userId,
				friendId,
			}
		});
		const user = await this.prisma.user.findFirst({
			where: {
				id: userId,
			}
		});
		console.log({ friendrequest, user });
		return { friendrequest, user };
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
				is_DM: true,
				AND: [
					{
						participants: {
							some: {
								uid: userId,
							},
						},
					},
					{
						participants: {
							some: {
								uid: friendId,
							},
						},
					},
				],
			}
		})) {
			console.log("hnaa-------------------------------------")
			return { friendrequest };
		}
		const chatRoom = this.creatChatRoom(userId, friendId);
		return { friendrequest, chatRoom };
	}

	async creatChatRoom(userId: string, friendId: string) {
		const chatRoom = await this.prisma.chatRoom.create({
			data: {
				name: 'Chat between ' + (await this.prisma.user.findUnique({ where: { id: userId } })).firstName
					+ ' and ' + (await this.prisma.user.findUnique({ where: { id: friendId } })).firstName,
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
		this.event.emit('joinroom', { chatRoom, userId, friendId });
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
		await this.prisma.friendShip.delete({
			where: {
				userId_friendId: {
					userId: friendId,
					friendId: userId,
				}
			},
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
				id: (await friendrequest).id,
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

	async blockUser(userId: string, friendId: string) {

		const check = await this.prisma.block.findFirst({
			where: {
				AND: [
					{
						uid: userId,
					},
					{
						fid: friendId,
					},
				],
			},
		});
		if (check)
			return;

		const block = await this.prisma.block.create({
			data: {
				uid: userId,
				fid: friendId,
			}
		});
		const chatroom = await this.prisma.chatRoom.findFirst({
			where: {
				is_DM: true,
				AND: [
					{
						participants: {
							some: {
								uid: userId,
							},
						},
					},
					{
						participants: {
							some: {
								uid: friendId,
							},
						},
					},
				],
			}
		});
		if (chatroom) {
			await this.prisma.participant.deleteMany({
				where: {
					rid: chatroom.id,
				}
			});
			console.log("hnaa-------------------------------------")
			await this.prisma.chatRoom.delete({
				where: {
					id: chatroom.id,
				}
			});
		}
		return block;
	}

	async unblockUser(userId: string, friendId: string) {
		const check = await this.prisma.block.findFirst({
			where: {
				AND: [
					{
						uid: userId,
					},
					{
						fid: friendId,
					},
				],
			},
		});
		if (!check)
			throw new UnauthorizedException('You are not allowed to do this');
		const block = await this.prisma.block.delete({
			where: {
				uid_fid: {
					uid: userId,
					fid: friendId,
				}
			}
		});
		await this.creatChatRoom(userId, friendId);
		return block;
	}

	// async getBlockedUsers(userId: string) {
	// 	const blockedUsers = await this.prisma.block.findMany({
	// 		where: {
	// 			uid: userId,
	// 		},
	// 	});
	// 	return blockedUsers;
	// }

	async deleteAccount(userId: string) {
		await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				status: "DELETED",
				isDeleted: true,
				picture: '',
				userName: userId,
				firstName: 'User',
				lastName: '',
			},
		});
	}

	async getFriends(userId: string) {
		const blockedlist = await this.prisma.block.findMany({
			where: {
				OR: [
					{
						uid: userId,
					},
					{
						fid: userId,
					},
				],
			},
		});
		let blockedIds = [];
		for (let i = 0; i < blockedlist.length; i++) {
			if (blockedlist[i].uid === userId)
				blockedIds.push(blockedlist[i].fid);
			else
				blockedIds.push(blockedlist[i].uid);
		}

		let friendRequests = await this.prisma.friendShip.findMany({
			where: {
				OR: [
					{
						userId,
						status: 'ACCEPTED',
					},
					{
						friendId: userId,
						status: 'ACCEPTED',
					},
				],
			},
			include: {
				user: true,
				friend: true,
			},
		});

		for (let friend of friendRequests) {
			if (friend.userId === userId) {
				friend.user = friend.friend;
				delete friend.friend;
			}
			else {
				friend.user = friend.user;
				delete friend.friend;
			}
			// if (blockedIds.includes(friend.user.id)) {

			// }

		}
		friendRequests = friendRequests.filter(friend => !blockedIds.includes(friend.user.id));
		// console.log(friendRequests);
		// for (let i = 0; i < friendRequests.length; i++) {
		// 	let friend = friendRequests[i];
		// 	let user = await this.prisma.user.findUnique({
		// 		where: {
		// 			id: friend.userId,
		// 		},
		// 		include: {

		// 	});
		// 	delete user.status;
		// 	friendRequests[i] = { ...friend, ...user };
		// }

		// const user = await this.prisma.user.findUnique({
		// 	where: {
		// 		id: friendRequests?.friendId
		// 	},
		// });
		return { friendRequests };
	}

	async getFriendRequests(userId: string) {
		let friendrequest = await this.prisma.friendShip.findMany({
			where: {
				friendId: userId,
				status: 'PENDING',
			},
			include: {
				user: true,
			},
		});
		// for (let i = 0; i < friendrequest.length; i++) {
		// 	let friend = friendrequest[i];
		// 	let user = await this.prisma.user.findUnique({
		// 		where: {
		// 			id: friend.userId,
		// 		},
		// 	});
		// 	delete user.status;
		// 	friendrequest[i] = { ...friend, ...user };
		// }

		return friendrequest;
	}

	async getIfBlocked(userId: string, friendId: string) {
		const blocked = await this.prisma.block.findFirst({
			where: {
				OR: [
					{
						uid: userId,
						fid: friendId,
					},
					{
						uid: friendId,
						fid: userId,
					},
				],
			},
		});
		if (blocked)
			return true;
		return false;
	}

	async getFriendProfile(userId: string, id: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		if (!user) {
			console.log("hnaa", userId)
			throw new HttpException('User not found', 404);
		}
		const friendship = await this.prisma.friendShip.findFirst({
			where: {
				OR: [
					{
						userId: id,
						friendId: userId,
					},
					{
						userId,
						friendId: id,
					}
				]
			},
		});
		// console.log({ user, ...await this.getLevelP(user.level), isfriend: friendship ? (friendship.status === 'ACCEPTED' ? 'friend' : 'cancel') : 'notfriend' })
		return { user, ...await this.getLevelP(user.level), isfriend: friendship ? (friendship.status === 'ACCEPTED' ? 'friend' : 'cancel') : 'notfriend', ifBlocked: await this.getIfBlocked(userId, id) };
	}

	async getFriendProfileWithUserName(userName: string, id: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				userName,
			},
		});
		if (!user) {
			console.log("machi hna")
			throw new HttpException('User not found', 404);
		}
		const friendship = await this.prisma.friendShip.findFirst({
			where: {
				userId: user.id,
				friendId: id,
			},
		});
		console.log('isfriend:', friendship ? (friendship.status === 'ACCEPTED' ? 'friend' : 'cancel') : 'notfriend')
		return { user, ...await this.getLevelP(user.level), isfriend: friendship ? (friendship.status === 'ACCEPTED' ? 'friend' : 'cancel') : 'notfriend', ifBlocked: await this.getIfBlocked(user.id, id) };
	}

	async getAllUsers() {
		return await this.prisma.user.findMany();
	}

	async getLevelP(lvl: number) {
		let level_P = 0;
		let i = lvl;
		let index = 20;
		let barPourcentage;
		while (i >= index) {
			i -= index;
			level_P++;
			index *= 2;
		}
		if (i > 0) {
			barPourcentage = (i / index) * 100;
		}
		return { level_P, barPourcentage };
	}

	async getProfile(userId: string) {
		let user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		return { user, ...await this.getLevelP(user.level) };
	}

	async getStats(body: any) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: body.id,
			},
			include: {
				wins: true,
				loses: true,
			}
		});
		let stats = {
			MP: 0,
			W: 0,
			L: 0,
			GS: 0,
			GC: 0
		}
		const games = await this.prisma.game.findMany({
			where: {
				AND: [
					{
						OR: [
							{
								winnerId: body.id,
							},
							{
								loserId: body.id,
							},
						],
					},
					{
						mode: body.mode,
					},
				],
			},
		});
		const gamestats = await this.prisma.game.findMany({
			where: {
				AND: [
					{
						OR: [
							{
								winnerId: body.id,
							},
							{
								loserId: body.id,
							},
						],
					},
					{
						mode: body.mode,
					},
				],
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: 5,
		});
		stats.MP = games.length;
		stats.W = games.filter(game => game.winnerId === body.id).length;
		stats.L = stats.MP - stats.W;
		stats.GS = games.reduce((total, game) => total + (game.winnerId === body.id ? game.player1Score : game.player2Score), 0);
		stats.GC = games.reduce((total, game) => total + (game.winnerId === body.id ? game.player2Score : game.player1Score), 0);
		return { stats, gamestats };
	}

	async getAchievements(userId: string) {
		const achievements = await this.prisma.achivement.findMany({
			where: {
				uid: userId,
			},
		});
		return achievements;
	}

	async getLeaderboard(body: any) {
		const users = await this.prisma.user.findMany({
			orderBy: {
				level: 'desc',
			},
			include: {
				wins: true,
				loses: true,
			},
		});

		for (let i = 0; i < users.length; i++) {
			const user = users[i];
			const levelInfo = await this.getLevelP(user.level);

			const games = await this.prisma.game.findMany({
				where: {
					OR: [
						{ winnerId: user.id },
						{ loserId: user.id },
					],
				},
			});

			let stats = {
				MP: 0,
				W: 0,
				L: 0,
				GS: 0,
				GC: 0,
			};

			if (games.length > 0) {
				stats.MP = games.length;
				stats.W = games.filter(game => game.winnerId === user.id).length;
				stats.L = stats.MP - stats.W;
				stats.GS = games.reduce((total, game) => total + (game.winnerId === user.id ? game.player1Score : game.player2Score), 0);
				stats.GC = games.reduce((total, game) => total + (game.winnerId === user.id ? game.player2Score : game.player1Score), 0);
			}
			users[i] = { ...user, ...levelInfo, ...stats };
		}
		return users;
	}

	async getBlockedList(userId: string) {
		const blockedList = await this.prisma.block.findMany({
			where: {
				uid: userId,
			},
			include: {
				friend: true,
			},
		});
		return blockedList;
	}
}