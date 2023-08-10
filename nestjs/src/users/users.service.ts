import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
    constructor(private jwt: JwtService,
                private config: ConfigService,
                private prisma: PrismaService){}
    async checkjwt(token: string){
        try {
            const payload = await this.jwt.verifyAsync(
              token,
              {
                secret: this.config.get('secret')
              }
              );
              const user = (await this.getuser(payload));
            return 'Welcome ' + user.firstName + ' ' + user.lastName;
        }
        catch {
            throw new UnauthorizedException();
        }
    }
    async getuser(payload: any){
        const user = await this.prisma.user.findUnique({
            where: {
                email: payload.email,
            },
        });
        return user;
    }
}