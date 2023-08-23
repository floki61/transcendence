import {  Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './tools/FortyTwoStrategy';
import { PassportModule} from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleStrategy } from './tools/google.strategy';


@Module({
  imports: [
    PassportModule.register({defaultStrategy: '42'}),
    ConfigModule.forRoot(),
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy, GoogleStrategy,PrismaService],
})
export class AuthModule { }