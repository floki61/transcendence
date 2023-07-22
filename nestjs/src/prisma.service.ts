import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export class PrismaService {
  private static instance: PrismaService;
  constructor() {
    if (!PrismaService.instance) {
      PrismaService.instance = this;
    }
    return PrismaService.instance;
  }

  async findMany(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async create(dt: any): Promise<User> {
    console.log('Input data:', dt);
  
    try {
      const newBook = await prisma.user.create({
        data: {
          name: dt,
        },
      });
  
      return newBook;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  

  async delete(id: number): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}