import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import e from 'express';
import { subscribe } from 'diagnostics_channel';
import { ChatGateway } from './chat.gateway';
import * as argon from 'argon2'

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


	//payload depan user_id, room_id
	async joinRoom(payload: any) {
		// console.log(payload);
		const room = await this.prisma.chatRoom.findUnique({
			where: {
				id: payload.rid,
			},
		})
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
				uid: payload.uid,
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
					uid: payload.uid,
					rid: payload.rid,
				},
			},
		});
		if (this.map.get(payload.uid)) {
			this.map.get(payload.uid).leave(payload.rid);
		}

		// this.map.get(payload.id).leave(payload.rid);
		// client.to(payload.rid).emit('message', { msg : 'kicked', room: payload.rid });
		return 'Kicked user';
	}

	// payload depan user_id, room_name, visibility, password if protected
	async createRoom(payload: any) {
		// console.log(payload);
		const room = await this.prisma.chatRoom.create({
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
			await this.prisma.chatRoom.update({
				where: {
					id: room.id,
				},
				data: {
					visibility: 'PROTECTED',
					password: hash,
				},
			});
		} else if (payload.visibility === 'PRIVATE') {	
			await this.prisma.chatRoom.update({
				where: {
					id: room.id,
				},
				data: {
					visibility: 'PRIVATE',
				},
			});
		}
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
		// console.log('parti', participant);
		// this.map.get(payload.uid).leave(payload.rid);
		// client.to(payload.rid).emit('message', { msg : 'banned', room: payload.rid });
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
		// this.map.get(payload.id).join(payload.rid);
		// client.to(payload.rid).emit('message', { msg : 'unbanned', room: payload.rid });
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
		client.to(payload.rid).emit('message', { msg : 'left', room: payload.rid });
		client.leave(payload.rid);
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
		// client.to(payload.rid).emit('message', { msg : 'muted', room: payload.rid });
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
		// client.to(payload.rid).emit('message', { msg : 'unmuted', room: payload.rid });
		return 'Unmuted user';
	}

	async getAllRoom() {
		const room = await this.prisma.chatRoom.findMany({
			include: {
				participants: true,
			},
		});
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
		// console.log({ message });
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
}
