import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './tools/FortyTwoStrategy';
import { PassportModule} from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { GoogleStrategy } from './tools/googleStrategy';



@Module({
  imports: [
    PassportModule.register({defaultStrategy: '42'}),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FortyTwoStrategy, GoogleStrategy, UsersService, ],
})
export class AuthModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AuthenticationMiddleware)
  //     .forRoutes('2fa/generate');
  // }
}