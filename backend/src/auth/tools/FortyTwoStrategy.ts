
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile} from 'passport-42';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy,'42') {
    constructor(private readonly config: ConfigService) {
        super({
            clientID: config.get('CLIENTID'),
            clientSecret: config.get('CLIENTSECRET'),
            callbackURL: config.get('CALLBACKURL'),
        });
    }

    async validate (accessToken: string, refreshToken: string, profile: Profile, done: any): Promise<any> {
        // console.log(profile._json.login);
        const user = {
            id: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            picture: profile._json.image.link,
            accessToken,
            login: profile._json.login
        };
        if(user)
            done(null, user);
        else
            done(null, false);
    }
}