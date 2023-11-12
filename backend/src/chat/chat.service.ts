import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import e from 'express';
import { subscribe } from 'diagnostics_channel';
import { ChatGateway } from './chat.gateway';
import * as argon from 'argon2';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ChatService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private eventEmitter: EventEmitter2,
	) { }

	map = new Map();

	async create(createChatDto: CreateChatDto, client: Socket) {
		var message = { ...createChatDto };
		console.log(createChatDto);

		const participant = await this.prisma.participant.findUnique({
			where: {
				uid_rid: {
					uid: createChatDto.uid,
					rid: createChatDto.rid,
				},
			},
		});

		if (!participant) {
			throw new NotFoundException('User not found in chat room');
		}
		if (participant.isBanned === true || participant.isMuted === true) {
			throw new UnauthorizedException('User cannot send message');
		}
		var mssg;
		try {
			mssg = await this.prisma.message.create({
				data: {
					userId: participant.id,
					msg: createChatDto.msg,
					rid: createChatDto.rid,
				},
			});
		} catch (error) {
			// Handle the exception and send an error message to the client
			client.emit('errorEvent', {
				message: 'An error occurred',
				error: error.message,
			});
		}
		await this.prisma.chatRoom.update({
			where: {
				id: createChatDto.rid,
			},
			data: {
				updatedAt: new Date(),
				lastMessage: createChatDto.msg,
				lastMessageDate: new Date(),
			},
		});
		message = { ...message, msgTime: mssg.msgTime };
		console.log(message);
		return message;
	}

	//payload depan uid, rid and password?
	async joinRoom(payload: any) {
		const room = await this.prisma.chatRoom.findUnique({
			where: {
				id: payload.rid,
			},
		});
		if (!room) {
			throw new NotFoundException('Chat room not found');
		}
		if (room.is_DM === true) throw new NotFoundException('Chat room is DM');
		if (room.visibility === 'PROTECTED') {
			if (!payload.password) {
				throw new NotFoundException('Password is required in protected room');
			}
			const isMatch = await argon.verify(room.password, payload.password);
			if (!isMatch) {
				throw new UnauthorizedException('Wrong password');
			}
		}
		if (room.visibility === 'PRIVATE') {
			throw new UnauthorizedException('Private room');
		}
		const user = await this.prisma.user.findUnique({
			where: {
				id: payload.uid,
			},
		});
		if (!user) {
			throw new NotFoundException('User not found');
		}
		// console.log('payload', payload)
		const participant = await this.prisma.participant.create({
			data: {
				uid: payload.uid,
				rid: payload.rid,
				role: 'USER',
			},
		});
		this.eventEmitter.emit('joinRoom', { uid: payload.uid, rid: payload.rid });
		return 'Joined room';
	}

	async kickUser(payload: any) {
		const room = await this.prisma.chatRoom.findUnique({
			where: {
				id: payload.rid,
			},
			include: {
				participants: true,
			},
		});
		if (!room) {
			throw new NotFoundException('Chat room not found');
		}
		const participant = await this.prisma.participant.findUnique({
			where: {
				uid_rid: {
					uid: payload.id,
					rid: payload.rid,
				},
			},
		});
		if (!participant) {
			throw new NotFoundException('User not found in chat room');
		}
		if (participant.role === 'OWNER') {
			throw new UnauthorizedException('Cannot kick owner');
		}
		// console.log(payload);
		await this.prisma.participant.delete({
			where: {
				uid_rid: {
					uid: payload.id,
					rid: payload.rid,
				},
			},
		});
		console.log(await this.map.size);
		if (this.map.get(payload.id)) {
			this.map.get(payload.id).leave(payload.rid);
		}
		this.eventEmitter.emit('kickUser', payload);
		return 'Kicked user';
	}

	// payload depan user_id, room_name, visibility, password if protected
	async createRoom(payload: any) {
		// console.log(payload);
		const user = await this.prisma.user.findUnique({
			where: {
				id: payload.id,
			},
		});
		if (!user) {
			throw new NotFoundException('User not found');
		}
		// if (!payload.name) {
		// 	throw new NotFoundException('name not found');
		// }
		var room = await this.prisma.chatRoom.create({
			data: {
				name: payload.name,
				is_DM: false,
			},
		});
		const participant = await this.prisma.participant.create({
			data: {
				uid: payload.id,
				rid: room.id,
				role: 'OWNER',
			},
		});
		if (payload.visibility === 'PROTECTED') {
			if (!payload.password) {
				throw new NotFoundException('Password is required in protected room');
			}
			const hash = await argon.hash(payload.password);
			room = await this.prisma.chatRoom.update({
				where: {
					id: room.id,
				},
				data: {
					visibility: 'PROTECTED',
					password: hash,
				},
			});
		} else if (payload.visibility === 'PRIVATE') {
			room = await this.prisma.chatRoom.update({
				where: {
					id: room.id,
				},
				data: {
					visibility: 'PRIVATE',
				},
			});
		}
		delete room.password;
		// console.log('room', room);
		return room;
	}

	//payload depan user_id, room_id
	async banUser(payload: any) {
		// console.log(payload.rid);
		// client.leave(payload.rid);
		const participant = await this.prisma.participant.findUnique({
			where: {
				uid_rid: {
					uid: payload.uid,
					rid: payload.rid,
				},
			},
		});
		if (!participant) {
			throw new NotFoundException('User not found in chat room');
		}
		if (participant.role === 'OWNER') {
			throw new UnauthorizedException('Cannot ban owner');
		}
		await this.prisma.participant.update({
			where: {
				uid_rid: {
					uid: payload.uid,
					rid: payload.rid,
				},
			},
			data: {
				isBanned: true,
			},
		});
		this.eventEmitter.emit('banUser', payload);
		return 'Banned user';
	}

	async unbanUser(payload: any) {
		// console.log(payload.rid);
		const participant = await this.prisma.participant.findUnique({
			where: {
				uid_rid: {
					uid: payload.uid,
					rid: payload.rid,
				},
			},
		});
		if (!participant) {
			throw new NotFoundException('User not found in chat room');
		}
		await this.prisma.participant.update({
			where: {
				uid_rid: {
					uid: payload.uid,
					rid: payload.rid,
				},
			},
			data: {
				isBanned: false,
			},
		});
		this.eventEmitter.emit('unbanUser', payload);
		return 'Unbanned user';
	}

	async leaveRoom(payload: any, client: Socket) {
		// console.log(payload.rid);
		const room = await this.prisma.chatRoom.findUnique({
			where: {
				id: payload.rid,
			},
			include: {
				participants: true,
			},
		});
		if (!room) {
			throw new NotFoundException('Chat room not found');
		}
		const participant = await this.prisma.participant.findUnique({
			where: {
				uid_rid: {
					uid: payload.uid,
					rid: payload.rid,
				},
			},
		});
		if (!participant) {
			throw new NotFoundException('User not found in chat room');
		}
		await this.prisma.participant.delete({
			where: {
				uid_rid: {
					uid: payload.uid,
					rid: payload.rid,
				},
			},
		});
		this.eventEmitter.emit('leaveRoom', payload);
		return 'Left room';
	}

	async deleteRoom(payload: any) {
		// console.log(payload.rid);
		const room = await this.prisma.chatRoom.findUnique({
			where: {
				id: payload.rid,
			},
			include: {
				participants: true,
			},
		});
		if (!room) {
			throw new NotFoundException('Chat room not found');
		}
		if (room.participants.length > 1) {
			throw new UnauthorizedException(
				'Cannot delete room with more than 1 participant',
			);
		}
		for (var participant of room.participants) {
			await this.prisma.participant.delete({
				where: {
					uid_rid: {
						uid: participant.uid,
						rid: payload.rid,
					},
				},
			});
		}
		await this.prisma.chatRoom.delete({
			where: {
				id: payload.rid,
			},
		});
		return 'Deleted room';
	}

	async muteUser(payload: any) {
		// console.log(payload.rid);

		const participant = await this.prisma.participant.findUnique({
			where: {
				uid_rid: {
					uid: payload.uid,
					rid: payload.rid,
				},
			},
		});
		if (!participant) {
			throw new NotFoundException('User not found in chat room');
		}
		if (participant.role === 'OWNER') {
			throw new UnauthorizedException('Cannot mute owner');
		}
		await this.prisma.participant.update({
			where: {
				uid_rid: {
					uid: payload.uid,
					rid: payload.rid,
				},
			},
			data: {
				isMuted: true,
			},
		});
		return 'Muted user';
	}

	async unmuteUser(payload: any) {
		// console.log(payload.rid);
		const participant = await this.prisma.participant.findUnique({
			where: {
				uid_rid: {
					uid: payload.uid,
					rid: payload.rid,
				},
			},
		});
		if (!participant) {
			throw new NotFoundException('User not found in chat room');
		}
		await this.prisma.participant.update({
			where: {
				uid_rid: {
					uid: payload.uid,
					rid: payload.rid,
				},
			},
			data: {
				isMuted: false,
			},
		});
		return 'Unmuted user';
	}

	async getAllRoom(id: any) {
		const room = await this.prisma.chatRoom.findMany({
			where: {
				is_DM: false,
				OR: [
					{
						AND: [
							{
								participants: {
									some: {
										uid: id,
										isBanned: false,
									},
								},
							},
							{
								visibility: 'PRIVATE',
							},
						],
					},
					{
						NOT: {
							visibility: 'PRIVATE',
						},
					},
				],
			},
			include: {
				participants: true,
			},
		});
		// console.log(room);
		return room;
	}

	async getMyRooms(payload: any) {
		const rooms = await this.prisma.chatRoom.findMany({
			where: {
				participants: {
					some: {
						uid: payload.id,
						isBanned: false,
					},
				},
				is_DM: true,
			},
			include: {
				messages: true, //{
				// orderBy:
				// {
				// 	msgTime: 'asc',
				// },
				//},
				participants: true,
			},
			orderBy: {
				updatedAt: 'desc',
			},
		});
		for (var room of rooms) {
			if (room.messages.length > 0) {
				room.lastMessage = room.messages[room.messages.length - 1].msg;
				room.lastMessageDate = room.messages[room.messages.length - 1].msgTime;
				delete room.messages;
			}
		}
		return rooms;
	}

	async getUniqueMyRooms(payload: any) {
		const room = await this.prisma.chatRoom.findMany({
			where: {
				participants: {
					some: {
						uid: payload.id,
						isBanned: false,
					},
				},
			},
		});
		if (!room) {
			throw new NotFoundException('Chat room not found');
		}
		// console.log(room);
		return room;
	}

	async getMessages(payload: any) {
		const message = await this.prisma.message.findMany({
			where: {
				rid: payload.rid,
			},
			include: {
				user: true,
			},
		});
		return message;
	}

	async changeVisibility(payload: any) {
		const room = await this.prisma.chatRoom.findUnique({
			where: {
				id: payload.rid,
			},
		});
		if (!room) {
			throw new NotFoundException('Chat room not found');
		}
		if (room.visibility === 'PROTECTED') {
			if (!payload.password) {
				throw new NotFoundException('Password is required in protected room');
			}
			const isMatch = await argon.verify(room.password, payload.password);
			if (!isMatch) {
				throw new UnauthorizedException('Wrong password');
			}
		}
		if (payload.visibility === 'PROTECTED') {
			if (!payload.password) {
				throw new NotFoundException('Password is required in protected room');
			}
			const hash = await argon.hash(payload.password);
			await this.prisma.chatRoom.update({
				where: {
					id: payload.rid,
				},
				data: {
					visibility: 'PROTECTED',
					password: hash,
				},
			});
		} else {
			await this.prisma.chatRoom.update({
				where: {
					id: payload.rid,
				},
				data: {
					visibility: payload.visibility,
				},
			});
		}
		return 'Changed visibility';
	}

	async changeRoomName(payload: any) {
		const room = await this.prisma.chatRoom.findUnique({
			where: {
				id: payload.rid,
			},
		});
		if (!room) {
			throw new NotFoundException('Chat room not found');
		}
		await this.prisma.chatRoom.update({
			where: {
				id: payload.rid,
			},
			data: {
				name: payload.name,
			},
		});
		return 'Changed room name';
	}

	async changePassword(payload: any) {
		const room = await this.prisma.chatRoom.findUnique({
			where: {
				id: payload.rid,
			},
		});
		if (!room) {
			throw new NotFoundException('Chat room not found');
		}
		if (room.visibility !== 'PROTECTED') {
			throw new NotFoundException('Room is not protected');
		}
		if (!payload.password) {
			throw new NotFoundException('Password is required in protected room');
		}
		const hash = await argon.hash(payload.password);
		await this.prisma.chatRoom.update({
			where: {
				id: payload.rid,
			},
			data: {
				password: hash,
			},
		});
		return 'Changed password';
	}

	async giveAdmin(payload: any) {
		const room = await this.prisma.chatRoom.findUnique({
			where: {
				id: payload.rid,
			},
		});
		if (!room) {
			throw new NotFoundException('Chat room not found');
		}
		const participant = await this.prisma.participant.findUnique({
			where: {
				uid_rid: {
					uid: payload.uid,
					rid: payload.rid,
				},
			},
		});
		if (!participant) {
			throw new NotFoundException('User not found in chat room');
		}
		if (participant.role === 'OWNER') {
			throw new UnauthorizedException('Cannot give admin to owner');
		}
		if (room.is_DM === true) {
			throw new UnauthorizedException('Cannot give admin to DM');
		}
		await this.prisma.participant.update({
			where: {
				uid_rid: {
					uid: payload.uid,
					rid: payload.rid,
				},
			},
			data: {
				role: 'ADMIN',
			},
		});
		return 'Gave admin';
	}

	async getUserPicture(uid: any) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: uid,
			},
		});
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return await user.picture;
	}

	async addParticipant(payload: any) {
		const room = await this.prisma.chatRoom.findUnique({
			where: {
				id: payload.rid,
			},
		});
		if (!room) {
			throw new NotFoundException('Chat room not found');
		}
		for (let uid of payload.uids) {
			const participant = await this.prisma.participant.findUnique({
				where: {
					uid_rid: {
						uid: uid,
						rid: payload.rid,
					},
				},
			});
			if (participant) {
				throw new UnauthorizedException('User already in chat room');
			}
			let newParticipant = await this.prisma.participant.create({
				data: {
					uid: uid,
					rid: payload.rid,
					role: 'USER',
				},
			});
		}
		// const user = await this.prisma.user.findUnique({
		// 	where: {
		// 		id: payload.id,
		// 	},
		// });
		// if (!user) {
		// 	throw new NotFoundException('User not found');
		// }
		// const participant = await this.prisma.participant.findUnique({
		// 	where: {
		// 		uid_rid: {
		// 			uid: payload.id,
		// 			rid: payload.rid,
		// 		},
		// 	},
		// });
		// if (participant) {
		// 	throw new UnauthorizedException('User already in chat room');
		// }
		// const newParticipant = await this.prisma.participant.create({
		// 	data: {
		// 		uid: payload.id,
		// 		rid: payload.rid,
		// 		role: 'USER',
		// 	},
		// });
		// console.log(newParticipant);
		return 'Added participant';
	}

	async getParticipant(payload: any) {
		const users = await this.prisma.user.findMany({
			where:{
				membership:{
					some:{
						rid: payload.rid,
					}
				}
			}
		})

		return users;
	}
}
