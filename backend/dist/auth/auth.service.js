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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const argon = require("argon2");
const library_1 = require("@prisma/client/runtime/library");
const users_service_1 = require("../users/users.service");
let AuthService = exports.AuthService = class AuthService {
    constructor(prisma, jwtService, config, userservice) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
        this.userservice = userservice;
    }
    async generateToken(req, tokenName) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: req.user.id,
            },
        });
        const payload = { id: user.id, email: user.email };
        let secretValue;
        if (tokenName == 'jwt')
            secretValue = this.config.get('JWT_SECRET_KEY');
        else if (tokenName == '2fa')
            secretValue = this.config.get('JWT_2FA_SECRET_KEY');
        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
            secret: secretValue,
        });
        return token;
    }
    async validateUser(req, res) {
        const user = await this.userservice.getUser(req.user.id);
        if (!user) {
            if (await this.userservice.checkIfnameExists(req.user.login)) {
                console.log("faild to login");
                throw new common_1.ForbiddenException('Username already exists');
            }
            await this.userservice.createUser(req);
        }
        else if (user && user.isTwoFactorAuthenticationEnabled) {
            const token = await this.generateToken(req, '2fa');
            res.cookie('2fa', token, { httpOnly: true, maxAge: 30 * 60 * 1000 });
            return true;
        }
        const token = await this.generateToken(req, 'jwt');
        res.cookie('access_token', token, { httpOnly: true, maxAge: 2592000000 });
        return user ? true : false;
    }
    async logout(req, res) {
        res.clearCookie('access_token');
    }
    async signup(dto) {
        const hash = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hash,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                },
            });
            delete user.password;
            return user;
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2002')
                    throw new common_1.ForbiddenException('Credentials taken');
            }
            throw error;
        }
    }
    async signin(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email }
        });
        const pwcomp = await argon.verify(user.password, dto.password);
        if (!pwcomp) {
            throw new common_1.ForbiddenException('UnMached Password');
        }
        delete user.password;
        return user;
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map