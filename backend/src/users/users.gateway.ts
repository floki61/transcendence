import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { UsersService } from "./users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import e from "express";
import { subscribe } from "diagnostics_channel";
import { Req } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";
import { OnEvent } from "@nestjs/event-emitter";

@WebSocketGateway({
	namespace: 'users',
	cors: { origin: `http://${process.env.MY_IP}:3000`, credentials: true },
})
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly chatService: UsersService,
		private jwt: JwtService,
		private config: ConfigService,
		private usr: UsersService,
		private prisma: PrismaService) { }
	@WebSocketServer()
	server: Server
	map: Map<Socket, string> = new Map();
	ingame: Map<string, string> = new Map();

	async handleConnection(client: any, ...args: any[]) {
		// console.log('client 1', client.id);

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
				client.join(payload.id);
				this.map.set(client, payload.id);
				// this.chatService.map.set(payload.id, client);
				// console.log('payload.sub', payload.id, 'added in array', this.map.values());
				//right if payload.id is in array then update status...
				if (this.findKeyByValue(this.ingame, payload.id) === undefined) {
					await this.prisma.user.update({
						where: {
							id: payload.id
						},
						data: {
							status: 'ONLINE'
						}
					});
				}
			}
			else {
				client.disconnect();
			}
		}
		else {
			client.disconnect();
		}
	}

	findKeyByValue<K, V>(map: Map<K, V>, targetValue: V): K | undefined {
		const entry = [...map.entries()].find(([key, value]) => value === targetValue);
		return entry ? entry[0] : undefined;
	}

	async handleDisconnect(client: any) {
		// console.log('client 2', client.id);
		let cookie: string;
		let payload: any;
		if (client.request.headers.cookie) {
			cookie = this.parseCookies(client.request.headers.cookie);
			payload = this.jwt.verify(
				cookie,
				{
					secret: this.config.get('JWT_SECRET_KEY')
				}
			);
			if (payload.id) {
				this.map.delete(client);
				// this.chatService.map.delete(payload.id);
				// console.log('payload.sub', payload.id, 'removed from array', this.map.values());
				if (this.findKeyByValue(this.map, payload.id) === undefined) {
					await this.prisma.user.update({
						where: {
							id: payload.id
						},
						data: {
							status: 'OFFLINE'
						}
					});
				}
			}
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

	@OnEvent('StatusEvent')
	async handleStatusEvent(payload: any) {

		if (payload.status === 'INGAME')
			this.ingame.set(payload.socket, payload.id);
		else if (payload.status === 'ONLINE') {
			this.ingame.delete(payload.socket);
			if (this.findKeyByValue(this.map, payload.id) === undefined) {
				await this.prisma.user.update({
					where: {
						id: payload.id
					},
					data: {
						status: 'OFFLINE'
					}
				});
			}
		}
	}
}
