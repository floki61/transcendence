import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FortyTwoStrategy } from './FortyTwoStrategy';
import { PassportModule, PassportSerializer } from '@nestjs/passport';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './users/user.module';
import { UsersService } from './users/user.service';
import { UserController } from './users/user.controller';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: '42'}),
    PrismaModule,
    UserModule
  ],
  controllers: [AppController, UserController],
  providers: [AppService, FortyTwoStrategy, UsersService, PrismaService],
})
export class AppModule { }