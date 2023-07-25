
// import { Module } from '@nestjs/common';
// import { UsersController } from './users/user.controller';
// import { UsersService } from './users/user.service';

// @Module({
//   controllers: [UsersController],
//   providers: [UsersService],
// })
// export class UsersModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleStrategy } from './google.strategy';
import { UsersService } from './users/user.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, UsersService],
})
export class AppModule { }