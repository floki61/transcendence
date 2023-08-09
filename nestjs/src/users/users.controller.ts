import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Controller('home')
export class UsersController {
    constructor(private config: ConfigService,
                private jwt: JwtService){}
    @Get()
    homepage(@Query('token') token: string) {
        // return token;
        try {
            const decodedToken = this.jwt.verify(token, this.config.get('secret'));
            return decodedToken;
            return `Welcome, ${decodedToken.email}`;
        } catch (error) {
            return 'Token validation failed';
        }
    }
}
