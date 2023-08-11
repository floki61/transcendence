import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from "src/prisma/prisma.service";
import { Userdto, signindto } from "src/users/dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
		{
			if(req.cookie && req.cookie['access_token'])
				return null;
			else
				return this.signToken(req.user.id, req.user.email);
		}
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
	}



	async    signup(dto: Userdto) {
        const hash = await argon.hash(dto.password);
        
        try {
            const user = await this.prisma.user.create({
                data: {
                    email:  dto.email,
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
    async   signin(dto: signindto) {

        const user = await this.prisma.user.findUnique({
            where:{ email: dto.email }
        });

        const pwcomp = await argon.verify(user.password, dto.password);

        if (!pwcomp) {
            throw new ForbiddenException('UnMached Password');
        }
        
        delete user.password;
        return user;
    }
}




