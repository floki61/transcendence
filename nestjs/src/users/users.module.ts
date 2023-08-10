import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({}),
  ],
  providers: [UsersService, PrismaService],
  controllers: [UsersController]
})
export class UsersModule {}
