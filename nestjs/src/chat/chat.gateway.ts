import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
// import { request } from 'express';
// import { Client } from 'socket.io/dist/client';

@WebSocketGateway({
	// cors: { origin: 'http://localhost:3000', credentials: true },
})
export class ChatGateway implements OnGatewayConnection {
	@WebSocketServer()
	server: Server
	map: Record<string, Socket>


	constructor(private readonly chatService: ChatService,
							private jwt: JwtService,
							private config: ConfigService ) { }

	async handleConnection(client: Socket) {
		// console.log(client.handshake.headers);
		const cookie = await this.parseCookies(client.request.headers.cookie);
		const payload = await this.jwt.verifyAsync(
				cookie,
			{
					secret: this.config.get('secret')
			}
		);
		if (payload.sub) {
			this.map[payload.sub] = client;
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
	
	@SubscribeMessage('createChat')
	async create(@MessageBody() createChatDto: CreateChatDto, client: Socket) {
		const message = await this.chatService.create(createChatDto);
		// console.log('message', message);
		this.server.emit('message', message);
		// this.server.to(createChatDto.rid).emit('message', message);
		return message;
	}

	@SubscribeMessage('findAllChat')
	findAll() {
		return this.chatService.findAll();
	}

	@SubscribeMessage('join')
	joinRoom(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
		console.log('payload', payload);
		return this.chatService.joinRoom(payload, client);
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
