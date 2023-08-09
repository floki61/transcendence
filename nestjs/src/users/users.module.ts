import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({}),
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
