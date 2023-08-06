import { ForbiddenException, Injectable } from '@nestjs/common';
import { Userdto, signindto } from './dto';
import * as argon from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}
    async    signup(dto: Userdto) {
        const hash = await argon.hash(dto.password);
        
        try {
            const user = await this.prisma.user.create({
                data: {
                    email:  dto.email,
                    password: hash,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                },
            });

            delete user.password

            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') // if this is an error of  duplicate a unique instance{
                    throw new ForbiddenException('Credentials taken');
                }
                throw error;
            }
        }
    async   signin(dto: signindto) {

        const user = await this.prisma.user.findUnique({
            where:{ email: dto.email }
        });

        const pwcomp = await argon.verify(user.password, dto.password);

        if (!pwcomp) {
            throw new ForbiddenException('UnMached Password');
        }
        
        delete user.password;
        return user;
    }
}
