
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor(private readonly config: ConfigService) {
        super({
            clientID: config.get('42_CLIENT_ID'),
            clientSecret: config.get('42_CLIENT_SECRET'),
            callbackURL: config.get('42_CALLBACK_URL'),
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: any): Promise<any> {
        const user = {
            id: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            picture: profile._json.image.link,
            username: profile.username,
            accessToken,
            login: profile._json.login
        };
        if (user)
            done(null, user);
        else
            done(null, false);
    }
}