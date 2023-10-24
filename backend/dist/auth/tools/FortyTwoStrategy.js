"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FortyTwoStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_42_1 = require("passport-42");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let FortyTwoStrategy = exports.FortyTwoStrategy = class FortyTwoStrategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy, '42') {
    constructor(config) {
        super({
            clientID: config.get('CLIENTID'),
            clientSecret: config.get('CLIENTSECRET'),
            callbackURL: config.get('CALLBACKURL'),
        });
        this.config = config;
    }
    async validate(accessToken, refreshToken, profile, done) {
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
};
exports.FortyTwoStrategy = FortyTwoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FortyTwoStrategy);
//# sourceMappingURL=FortyTwoStrategy.js.map