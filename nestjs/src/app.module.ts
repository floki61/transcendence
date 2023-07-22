// books.module.ts

import { Module } from '@nestjs/common';
import { UsersController } from './users/user.controller';
import { UsersService } from './users/user.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

