import {  Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './FortyTwoStrategy';
import { PassportModule} from '@nestjs/passport';
import { PrismaService } from '../prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: '42'}),
    ConfigModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy, PrismaService],
})
export class AuthModule { }