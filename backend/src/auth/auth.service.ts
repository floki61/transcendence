import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { PrismaService } from "src/prisma/prisma.service";
import { Userdto, signindto } from "src/users/dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UsersService } from "src/users/users.service";

@Injectable()

export class AuthService {
	constructor(private prisma: PrismaService,
		private jwtService: JwtService,
		private config: ConfigService,
		private userservice: UsersService) {}

	async generateToken(req): Promise<string> {

		const user = await this.prisma.user.findUnique({
			where: {
				id: req.user.id,
			},
		});
		const payload = { id: user.id, email: user.email };
		const token = await this.jwtService.signAsync(
			payload,
			{
				expiresIn: '2000m',
				secret: this.config.get('secret'),
			},
		);
		console.log(token);
		return token;
	}

	async validateUser(req, res) {
		const user = await this.userservice.getUser(req.user.id);
		if (!user)
			await this.userservice.createUser(req);
		const token = await this.generateToken(req);
		res.cookie('access_token', token, { httpOnly: true, maxAge: 600000});
	}
	async logout (req, res) {
		res.clearCookie('access_token');
	}

	async signup(dto: Userdto) {
		const hash = await argon.hash(dto.password);
		try {
			const user = await this.prisma.user.create({
				data: {
					email: dto.email,
					password: hash,
					firstName: dto.firstName,
					lastName: dto.lastName,
				},
			});
			delete user.password
			return user;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') // if this is an error of  duplicate a unique instance{
					throw new ForbiddenException('Credentials taken');
			}
			throw error;
		}
	}
	
	async signin(dto: signindto) {
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email }
		});
		const pwcomp = await argon.verify(user.password, dto.password);
		if (!pwcomp) {
			throw new ForbiddenException('UnMached Password');
		}
		// this.signToken(user.id, user.email);
		delete user.password;
		return user;
	}
}

