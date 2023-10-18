import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ChatController } from './chat.controller';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [ PrismaModule,
    JwtModule.register({}),
   ],
  providers: [ChatGateway, ChatService, PrismaService, UsersService, JwtService, ConfigService],
  controllers: [ChatController],
})
export class ChatModule {}
