import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import e from 'express';
import { subscribe } from 'diagnostics_channel';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService, private jwt: JwtService) { }

	map = new Map();

	async create(createChatDto: CreateChatDto, client: Socket) {
		const message = { ...createChatDto };
		// console.log( createChatDto );
		try {
		await this.prisma.message.create({
			data: {
			userId: createChatDto.id,
			msg: createChatDto.msg,
			rid: createChatDto.rid,
			}
		});
		} catch (error) {
			// Handle the exception and send an error message to the client
			client.emit('errorEvent', { message: 'An error occurred', error: error.message });
		}
		return message;
	}

	async joinRoom(payload: any, client: Socket) {
		// console.log(payload);
		const room = await this.prisma.chatRoom.findUnique({
			where: {
				id: payload.rid,
			},
			include: {
				participants: true,
			},
		})
		if (!room) {
			throw new NotFoundException('Chat room not found');
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
			},
		});
		// const participant = this.prisma.participant.findUnique({
		// 	where: {
		// 		uid_rid: {
		// 		uid: payload.id,
		// 		rid: payload.rid,
		// 		},
		// 	},
		// });
		// if (!participant) {
		// 	throw new NotFoundException('User not found in chat room');
		// }
		// client.join(payload.rid);
		// client.to(payload.rid).emit('message', { msg : 'joined', room: payload.rid });

		// client.to(payload.rid).emit('joined', payload);
		return 'Joined room';
	}

	async kickUser(payload: any, client: Socket) {
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
		// console.log(payload);
		await this.prisma.participant.delete({
			where: {
				uid_rid: {
					uid: payload.uid,
					rid: payload.rid,
				},
			},
		});
		if (this.map.get(payload.uid)) {
			this.map.get(payload.uid).leave(payload.rid);
		}

		// this.map.get(payload.id).leave(payload.rid);
		client.to(payload.rid).emit('message', { msg : 'kicked', room: payload.rid });
		return 'Kicked user';
	}


	async createRoom(payload: any, client: Socket) {
		console.log(payload);
		const room = await this.prisma.chatRoom.create({
			data: {
				name: payload.name,
			},
		});
		const participant = await this.prisma.participant.create({
			data: {
				uid: payload.id,
				rid: room.id,
				role: 'OWNER',
			},
		});
		return room;
	}

	async banUser(payload: any, client: Socket) {
		// console.log(payload.rid);
		// client.leave(payload.rid);
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
		await this.prisma.participant.update({
			where: {
				uid_rid: {
				uid: payload.id,
				rid: payload.rid,
				},
			},
			data: {
				isBanned: true,
			},
		});
		this.map.get(payload.id).leave(payload.rid);
		client.to(payload.rid).emit('message', { msg : 'banned', room: payload.rid });
		return 'Banned user';
	}

	async unbanUser(payload: any, client: Socket) {
		// console.log(payload.rid);
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
		await this.prisma.participant.update({
			where: {
				uid_rid: {
				uid: payload.id,
				rid: payload.rid,
				},
			},
			data: {
				isBanned: false,
			},
		});
		this.map.get(payload.id).join(payload.rid);
		client.to(payload.rid).emit('message', { msg : 'unbanned', room: payload.rid });
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
				uid: payload.id,
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
					uid: payload.id,
					rid: payload.rid,
				},
			},
		});
		client.leave(payload.rid);
		client.to(payload.rid).emit('message', { msg : 'left', room: payload.rid });
		return 'Left room';
	}

	async deleteRoom(payload: any, client: Socket) {
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
		await this.prisma.chatRoom.delete({
			where: {
				id: payload.rid,
			},
		});
		return 'Deleted room';
	}

	async muteUser(payload: any, client: Socket) {
		// console.log(payload.rid);
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
		await this.prisma.participant.update({
			where: {
				uid_rid: {
				uid: payload.id,
				rid: payload.rid,
				},
			},
			data: {
				isMuted: true,
			},
		});
		client.to(payload.rid).emit('message', { msg : 'muted', room: payload.rid });
		return 'Muted user';
	}

	async unmuteUser(payload: any, client: Socket) {
		// console.log(payload.rid);
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
		await this.prisma.participant.update({
			where: {
				uid_rid: {
				uid: payload.id,
				rid: payload.rid,
				},
			},
			data: {
				isMuted: false,
			},
		});
		client.to(payload.rid).emit('message', { msg : 'unmuted', room: payload.rid });
		return 'Unmuted user';
	}


  // findOne(id: number) {
  //   return `This action returns a #${id} chat`;
  // }

  // update(id: number, updateChatDto: UpdateChatDto) {
  //   return `This action updates a #${id} chat`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} chat`;
  // }
}
