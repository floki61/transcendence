import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma.service';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
private static instance: UsersService;
  constructor() {
    if (!UsersService.instance) {
      UsersService.instance = this;
    }
    return UsersService.instance;
  }

  async findAllUsers() {
    return prisma.user.findMany();
  }

  async createUser(Username: string): Promise<User>{
    console.log('Input data:', Username);
    try {
      const newUser = await prisma.user.create({
        data: {
          name: Username,
        },
      });
      return newUser;
    }
    catch (error) {
      console.error('Error creating user:', error);
      throw error;
  }
}
}
