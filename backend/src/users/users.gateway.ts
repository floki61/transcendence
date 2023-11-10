import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { UsersService } from "./users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import e from "express";
import { subscribe } from "diagnostics_channel";
import { Req } from "@nestjs/common";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ namespace: 'users' ,
cors: { origin: 'http://localhost:3000', credentials: true },
})
export class UsersGateway implements OnGatewayConnection {
    constructor(private readonly chatService: UsersService,
        private jwt: JwtService,
        private config: ConfigService,
        private usr: UsersService) { }
	@WebSocketServer()
	server: Server

    async handleConnection(client: any, ...args: any[]) {
		console.log('client 1', client.id);

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
					// this.chatService.map.set(payload.id, client);
				console.log('payload.sub', payload.id)
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
}
