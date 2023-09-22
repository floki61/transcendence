import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { WsGuard } from 'src/auth/tools/ws.guard';
// import { request } from 'express';
// import { Client } from 'socket.io/dist/client';

@WebSocketGateway({
	// cors: { origin: 'http://localhost:3000', credentials: true },
})
export class ChatGateway implements OnGatewayConnection {
	@WebSocketServer()
	server: Server
	// map = new Map();

	constructor(private readonly chatService: ChatService,
							private jwt: JwtService,
							private config: ConfigService ) { }

	async handleConnection(client: Socket) {
		let cookie: string;
		let payload: any;
		if (client.request.headers.cookie) {
			cookie = await this.parseCookies(client.request.headers.cookie);
			payload = await this.jwt.verifyAsync(
				cookie,
				{
					secret: this.config.get('secret')
				}
				);
				if (payload.id) {
					this.chatService.map.set(payload.id, client);
				// console.log('payload.sub', this.map)
			}
		}
		else {
			client.disconnect();
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
		// console.log('message', message);
		// this.server.to(message.rid).emit('message', message.msg);
		this.server.to(createChatDto.rid).emit('message', { userid: message.id, msg: message.msg });
		return message;
	}
	
	// @UseGuards(WsGuard)
	@SubscribeMessage('joinRoom')
	joinRoom(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
		// console.log('payload', payload);
		this.chatService.map.get(payload.id).join(payload.rid);
		return this.chatService.joinRoom(payload, client);
	}

	@SubscribeMessage('kickUser')
	kickUser(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
		// console.log('payload', payload);
		// this.chatService .map.get(payload.uid).leave(payload.rid);
		return this.chatService.kickUser(payload, client);
	}


	@SubscribeMessage('banUser')
	banUser(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
		// console.log('payload', payload);
		return this.chatService.banUser(payload, client);
	}

	@SubscribeMessage('unbanUser')
	unbanUser(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
		// console.log('payload', payload);
		return this.chatService.unbanUser(payload, client);
	}

	@SubscribeMessage('leave')
	leaveRoom(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
		// console.log('payload', payload);
		return this.chatService.leaveRoom(payload, client);
	}

	@SubscribeMessage('createRoom')
    async createRoom(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
		console.log('payload', payload);
		const room = await this.chatService.createRoom(payload, client);
        return room;
    }

	@SubscribeMessage('deleteRoom')
	async deleteRoom(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
		const room = await this.chatService.deleteRoom(payload, client);
		return room;
	}

	@SubscribeMessage('muteUser')
	muteUser(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
		// console.log('payload', payload);
		return this.chatService.muteUser(payload, client);
	}

	@SubscribeMessage('unmuteUser')
	unmuteUser(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
		// console.log('payload', payload);
		return this.chatService.unmuteUser(payload, client);
	}
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
