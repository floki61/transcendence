import { Injectable, NestMiddleware} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    constructor(private jwt: JwtService,
                private userService: UsersService,
                private config: ConfigService,) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies['access_token'];
        if (!token)
            return res.status(401).json({ message: 'Unauthorized' });
        try {
            const payload = await this.jwt.verifyAsync(
                token,
                {
                    secret: this.config.get('secret')
                }
            );
            const user = await this.userService.getuser(payload.id);
            req['user'] = user;
            next();
        }
        catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
}