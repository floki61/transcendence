import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ PrismaModule,
    JwtModule.register({}),
   ],
  providers: [ChatGateway, ChatService, PrismaService],
})
export class ChatModule {}
