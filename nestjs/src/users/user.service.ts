import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UsersService
{
  // private static instance: UsersService;
  // constructor()
  // {
  //   if (!UsersService.instance)
  //     UsersService.instance = this;
  //   return UsersService.instance;
  // }

  // async findAllUsers()
  // {
  //   return prisma.user.findMany();
  // }

  // async createUser(req): Promise<User>
  // {
  //   try
  //   {
  //     const newUser = await prisma.user.create({
  //       data: 
  //       {
  //         firstName: req.user.firstName,
  //         lastName: req.user.lastName,
  //         email: req.user.email,
  //         picture: req.user.picture
  //       },
  //     });
  //     return newUser;
  //   }
  //   catch (error)
  //   {
  //     console.error('Error creating user:', error);
  //     throw error;
  //   }
  // }
  // async getUserImage(req)
  // {
  //   try {
  //     const user= await prisma.user.findFirst({
  //     where:{
  //       firstName: req.user.firstName,
  //     },
  //     })
  //     return user.picture;
  //   }
  //   catch(error){
  //     console.error('Error finding user:', error);
  //     throw error;
  //   }
  // }
}
