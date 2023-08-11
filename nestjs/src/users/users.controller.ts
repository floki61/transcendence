import { Controller, Get, Body, Query ,UnauthorizedException} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { promises } from 'dns';
import { UsersService } from './users.service';

@Controller('home')
export class UsersController {
    constructor(private config: ConfigService,
                private jwt: JwtService,
                private userservice: UsersService) {}
    @Get()
    async homepage(@Query('token') token: string) {
        return this.userservice.checkjwt(token);
    }
}
