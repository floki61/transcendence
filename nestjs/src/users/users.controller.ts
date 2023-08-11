import { Controller, Get, Body, Req ,UnauthorizedException} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { promises } from 'dns';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('home')
export class UsersController {
    constructor(private config: ConfigService,
                private jwt: JwtService,
                private userservice: UsersService) {}
    @Get()
    async homepage(@Req() req: Request) {
        return this.userservice.checkjwt(req.cookies['access_token']);
    }
}
