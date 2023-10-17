import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { twoFactorAuthModule} from 'src/auth/twofactorauth/twofactorauth.module';
import { AppService } from './app.service';
import { FortyTwoStrategy } from 'src/auth/tools/FortyTwoStrategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { AppController } from './app.controller';
import { AuthController } from 'src/auth/auth.controller';
import { ChatModule } from 'src/chat/chat.module';
import { UsersService } from 'src/users/users.service';
import { GameController } from 'src/game/game.controller';
import { GameModule } from 'src/game/game.module';
import { GameGateway } from 'src/game/game.gateway';
import { GameService } from 'src/game/game.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    UsersModule,
    AuthModule,
    twoFactorAuthModule,
    PrismaModule,
    JwtModule.register({}),
    ChatModule,
    GameModule,
  ],
  controllers: [AppController, AuthController, GameController],
  providers: [JwtService, AppService, FortyTwoStrategy, PrismaService, AuthService, UsersService, GameGateway, GameService],
})
export class AppModule { }