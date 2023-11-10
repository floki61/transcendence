import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { clearConfigCache } from 'prettier';

@Injectable()
export class TwoFaStrategy extends PassportStrategy(Strategy, '2fa') {
    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                // console.log({cokiya: req.cookies});
                if(req.cookies && req.cookies['2fa'])
                    return req.cookies['2fa'];
                else
                    return null;
            },
            ]),
            secretOrKey: config.get('JWT_2FA_SECRET_KEY'),
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