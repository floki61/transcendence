import { promises } from "dns";
import { PrismaService } from "./prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()

export class AppService{
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

// import { Injectable } from '@nestjs/common';
// import { userInfo } from 'os';
// import { UsersService } from './users/user.service';
// import { User } from '@prisma/client';
// 
// @Injectable()
// export class AppService {
//     private readonly userservice: UsersService;
//     constructor(private readonly userService: UsersService) {
//         this.userservice = userService;
//       }
//   response(req){
//     if (!req.user) {
//       return 'No user from google'
//     }
//     this.userservice.createUser(req);
//     ;
//     return req.user.firstName;
//   }
// }

