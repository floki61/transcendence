import { Injectable } from '@nestjs/common';
import { userInfo } from 'os';
import { UsersService } from './users/user.service';
import { User } from '@prisma/client';

@Injectable()
export class AppService {
    // private readonly userservice: UsersService;
  googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }
    // this.userservice.createUser(req);
    return {
      message: 'User Info from Google',
      user: req.user
    }
  }
  hello() {
    return "Hello"
  }
}