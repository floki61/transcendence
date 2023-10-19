import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { UsersGateway } from './users.gateway';


@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({}),
    MulterModule.register({ dest: './uploads' }),
  ],
  providers: [UsersService, PrismaService, UsersGateway],
  controllers: [UsersController]
})
export class UsersModule {}
