import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
            (req: Request) => {
                if(req.cookies && req.cookies['access_token'])
                    return req.cookies['access_token'];
                else
                    return null;
            },
            ]),
            secretOrKey: config.get('secret'),
        });
    }

    async validate(payload: {id: string}) {
        return this.prisma.user.findUnique({
            where: {
              id: payload.id,
            },
        });
    }
}
