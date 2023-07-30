import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FortyTwoStrategy } from './FortyTwoStrategy';
import { UsersService } from './users/user.service';
import { PassportModule, PassportSerializer } from '@nestjs/passport';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: '42'})
  ],
  controllers: [AppController],
  providers: [AppService, FortyTwoStrategy, UsersService, PrismaService],
})
export class AppModule { }