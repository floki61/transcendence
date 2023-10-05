import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { APP_FILTER } from '@nestjs/core';
import { ExceptionsFilter } from 'src/filter_ex/exception_filter';
import { config } from 'dotenv';
import { MulterModule } from '@nestjs/platform-express';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    UsersModule,
    AuthModule,
    twoFactorAuthModule,
    MulterModule.register({ dest: './uploads' }),
    PrismaModule,
    JwtModule.register({}),
    ChatModule,
  ],
  controllers: [AppController, AuthController, UsersController],
  providers: [JwtService, AppService, FortyTwoStrategy, PrismaService, AuthService, ConfigService, UsersService,
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
  ],
})
export class AppModule { }