import { CanActivate, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class WsGuard implements CanActivate {

    constructor(private userService: UsersService,
                private jwt: JwtService,
                private config: ConfigService) {}

    canActivate(
        context: any,
    ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
        const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
        try {
            const decoded = this.jwt.verify(bearerToken, this.config.get("JWT_SECRET_KEY")) as any;
            return new Promise((resolve, reject) => {
                return this.userService.getUser(decoded.id).then(user => {
                    if (user) {
                        resolve(user);
                    } else {
                        reject(false);
                    }
                });

             });
        } catch (ex) {
            console.log(ex);
            return false;
        }
    }
}