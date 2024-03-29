import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { WsGuard } from 'src/auth/tools/ws.guard';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { subscribe } from 'diagnostics_channel';
// import * as dotenv from 'dotenv';


@WebSocketGateway({
	namespace: 'chat',
	cors: { origin: `http://${process.env.MY_IP}:3000`, credentials: true },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server
	map = new Map();

	constructor(private readonly chatService: ChatService,
		private jwt: JwtService,
		private config: ConfigService,
		private event: EventEmitter2) { }

	async handleConnection(client: Socket) {
		let cookie: string;
		let payload: any;
		if (client.request.headers.cookie) {
			cookie = await this.parseCookies(client.request.headers.cookie);
			payload = await this.jwt.verifyAsync(
				cookie,
				{
					secret: this.config.get('JWT_SECRET_KEY')
				});
			if (payload.id) {
				// console.log("chat socket : ", payload.id);
				this.map.set(payload.id, client);
			} else {
				client.disconnect();
			}

			const rooms = await this.chatService.getUniqueMyRooms(payload);
			if (rooms) {
				(rooms).forEach((room: any) => {
					client.join(room.id);
				});
			}
		}
		else {
			client.disconnect();
		}
	}

	async handleDisconnect(client: Socket) {
		let cookie: string;
		let payload: any;
		if (client.request.headers.cookie) {
			cookie = await this.parseCookies(client.request.headers.cookie);
			payload = await this.jwt.verifyAsync(
				cookie,
				{
					secret: this.config.get('JWT_SECRET_KEY')
				}
			);
			if (payload.id) {
				this.map.delete(payload.id);
			}
		}
		const rooms = this.chatService.getMyRooms(payload);
		if (rooms) {
			(await rooms).forEach((room: any) => {
				client.leave(room.id);
			});
		}
	}

	private parseCookies(cookieHeader: string | undefined): string {
		const cookies: Record<string, string> = {};
		if (cookieHeader) {
			cookieHeader.split(';').forEach((cookie) => {
				const parts = cookie.split('=');
				const name = parts.shift()?.trim();
				let value = decodeURI(parts.join('='));
				if (value.startsWith('"') && value.endsWith('"')) {
					value = value.slice(1, -1);
				}
				if (name) {
					cookies[name] = value;
				}
			});
		}
		return cookies['access_token'];
	}

	// @UseGuards(WsGuard)

	@SubscribeMessage('createChat')
	async create(@MessageBody() createChatDto: CreateChatDto, client: Socket) {
		const message = await this.chatService.create(createChatDto, client);
		if (message === '')
			return ;
		this.server.to(createChatDto.rid).emit('message', message);
		this.updateChatRooms({ uid: message.uid });
		return message;
	}
	// @UseGuards(WsGuard)
	// payload depand on rid uid and password
	@OnEvent('joinRoom')
	async joinRoom(@MessageBody() payload: any) {
		if (this.map.has(payload.uid))
			this.map.get(payload.uid).join(payload.rid);
	}

	@OnEvent('kickUser')
	kickUser(@MessageBody() payload: any) {
		if (this.map.has(payload.uid))
			this.map.get(payload.uid).leave(payload.rid);
	}


	@OnEvent('banUser')
	banUser(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
		if (this.map.has(payload.uid))
			this.map.get(payload.uid).leave(payload.rid);
	}

	@OnEvent('unbanUser')
	unbanUser(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
		if (this.map.has(payload.uid))
			this.map.get(payload.uid).join(payload.rid);
	}

	@OnEvent('leaveRoom')
	leaveRoom(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
		if (this.map.has(payload.uid))
			this.map.get(payload.uid).leave(payload.rid);
	}

	@OnEvent('endgame')
	async updateStatus(@MessageBody() payload: any) {
		// if (this.map.has(payload.id)) {
		// 	await this.chatService.updateStatus(1, payload.id);
		// }
		// else {
		// 	await this.chatService.updateStatus(0, payload.id);
		// }
	}

	// @SubscribeMessage('updateChatRooms')
	async updateChatRooms(@MessageBody() payload: any) {
		const rooms = await this.chatService.getMyRooms(payload);
		this.server.emit('chatRoomsUpdated', rooms);
		return rooms;
	}

	@OnEvent('joinroom')
	joinroom(@MessageBody() payload: any) {
		if (this.map.has(payload.userId))
			this.map.get(payload.userId).join(payload.chatRoom.id);
		if (this.map.has(payload.friendId))
			this.map.get(payload.friendId).join(payload.chatRoom.id);
	}

	// @SubscribeMessage('createRoom')
	// async createRoom(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
	// 	// console.log('payload', payload);
	// 	const room = await this.chatService.createRoom(payload);
	//     return room;
	// }

	// @SubscribeMessage('deleteRoom')
	// async deleteRoom(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
	// 	const room = await this.chatService.deleteRoom(payload);
	// 	return room;
	// }

	// @SubscribeMessage('muteUser')
	// muteUser(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
	// 	// console.log('payload', payload);
	// 	return this.chatService.muteUser(payload);
	// }

	// @SubscribeMessage('unmuteUser')
	// unmuteUser(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
	// 	// console.log('payload', payload);
	// 	return this.chatService.unmuteUser(payload);
	// }
	// @SubscribeMessage('findOneChat')
	// findOne(@MessageBody() id: number) {
	//   return this.chatService.findOne(id);
	// }


	// @SubscribeMessage('updateChat')
	// update(@MessageBody() updateChatDto: UpdateChatDto) {
	//   return this.chatService.update(updateChatDto.id, updateChatDto);
	// }


	// @SubscribeMessage('removeChat')
	// remove(@MessageBody() id: number) {
	//   return this.chatService.remove(id);
	// }
}
