import { Profile } from 'passport-42';
import { ConfigService } from '@nestjs/config';
declare const FortyTwoStrategy_base: new (...args: any[]) => any;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    private readonly config;
    constructor(config: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: Profile, done: any): Promise<any>;
}
export {};
