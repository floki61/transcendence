import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FortyTwoStrategy } from './FortyTwoStrategy';
import { UsersService } from './users/user.service';
import { PassportModule, PassportSerializer } from '@nestjs/passport';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: '42'}),
    PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService, FortyTwoStrategy, UsersService, PrismaService],
})
export class AppModule { }