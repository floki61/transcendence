import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()

export class AuthService{
	constructor(private prisma: PrismaService) {}

	async validateuser(req): Promise<any> {
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
		return "user created";
	}
}


