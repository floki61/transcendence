import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor() {
    super({
      clientID: '568158696817-f1v8d77ubd99pqa5ru2il7b479g0cm39.apps.googleusercontent.com',
      clientSecret: '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',
    //   clientID: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:4000/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;

    const user = {
      id: profile.id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      login: name.givenName + name.familyName,
      accessToken,
      
    }
    done(null, user);
  }
}