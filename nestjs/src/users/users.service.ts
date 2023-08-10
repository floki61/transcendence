import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(private jwt: JwtService,
                private config: ConfigService){}
    async checkjwt(token: string) : Promise<string>{
        try {
            const payload = await this.jwt.verifyAsync(
              token,
              {
                secret: this.config.get('secret')
              }
            );
            return 'Welcome ' + payload.email;
        }
        catch {
            throw new UnauthorizedException();
        }

    }
}
