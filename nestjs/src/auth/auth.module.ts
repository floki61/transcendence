import {  MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './tools/FortyTwoStrategy';
import { PassportModule} from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleStrategy } from './tools/google.strategy';
import { AuthenticationMiddleware } from './tools/authenticatinMiddleware';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';


@Module({
  imports: [
    PassportModule.register({defaultStrategy: '42'}),
    ConfigModule.forRoot(),
    JwtModule.register({}),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy, GoogleStrategy, PrismaService, AuthenticationMiddleware, UsersService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes('2fa/generate');
  }
}