import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [UsersService, PrismaService]
})
export class UserModule {}
