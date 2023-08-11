import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule, PassportSerializer } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { FortyTwoStrategy } from 'src/auth/tools/FortyTwoStrategy';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthController } from 'src/auth/auth.controller';
import { UsersService } from 'src/users/users.service';
import { UsersController } from 'src/users/users.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // this will be available in all modules without the need to import it again
    }),
    JwtModule.register({}),
    PassportModule.register({defaultStrategy: '42'}),
    PrismaModule,
    AuthModule,
    UsersModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, FortyTwoStrategy, PrismaService, AuthService],
})
export class AppModule { }