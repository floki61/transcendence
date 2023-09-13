import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticationMiddleware } from 'src/auth/tools/authenticatinMiddleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({}),
  ],
  providers: [UsersService, PrismaService, AuthenticationMiddleware],
  controllers: [UsersController]
})
export class UsersModule {}
