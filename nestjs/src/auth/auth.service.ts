import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()

export class AuthService{
	constructor(private prisma: PrismaService,
                private jwtService: JwtService,
				private config: ConfigService) {}

	async signToken(userId: number, email: string): Promise<string>
	{
		const payload = {sub: userId, email};
		const token = await this.jwtService.signAsync(
			payload,
			{
				expiresIn: '10m',
				secret: this.config.get('secret'),
			},
		);
		// res.cookie('access_token', token, { httpOnly: true, maxAge: 600000 });
		return token;
	}

	async validateuser(req): Promise<string> {
		const ifd = parseInt(req.user.id);
		const user = await this.prisma.user.findUnique({
			where: {
				id: ifd,
			},
		});

		if(user)
			return "already created";
		const newUser = await this.prisma.user.create({
			data: 
			{
				id: ifd,
				firstName: req.user.firstName,
				lastName: req.user.lastName,
				email: req.user.email,
				picture: req.user.picture
			},
		});
		return this.signToken(req.user.id, req.user.email);
		return "user created";
	}
}




