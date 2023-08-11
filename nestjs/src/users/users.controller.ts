import { Controller, Get, Query ,Req,UnauthorizedException} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express'
import { UsersService } from './users.service';


@Controller('home')
export class UsersController {
    constructor(private config: ConfigService,
                private jwt: JwtService,
                private userservice: UsersService) {}
    @Get()
    async homepage(@Req() request: Request) {
        if(request.cookies && request.cookies['access_token']){
            return this.userservice.checkjwt(request.cookies['access_token']);
        }
    }
}
