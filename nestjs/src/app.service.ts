import { Injectable } from '@nestjs/common';
import { userInfo } from 'os';
import { UsersService } from './users/user.service';
import { User } from '@prisma/client';

@Injectable()
export class AppService {
    private readonly userservice: UsersService;
    constructor(private readonly userService: UsersService) {
        this.userservice = userService;
      }
  googleLogin(req){
    if (!req.user) {
      return 'No user from google'
    }
    this.userservice.createUser(req);
    return this.userService.getUserImage(req);
      // message: 'User Info from Google',
      // user: req.user,
      // image: this.userservice.getUserImage(req)
  }
  hello() {
    return "Hello"
  }
}

