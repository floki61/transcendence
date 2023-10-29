import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { TwoFactorAuthService } from './twofactorauth.service';
import { TwoFactorAuthController } from './twofactorauth.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { TwoFaStrategy } from './guard/2fa.strategy';



@Module({
  imports: [UsersModule],
  controllers: [TwoFactorAuthController],
  providers: [TwoFactorAuthService, JwtService, AuthService, UsersService, TwoFaStrategy],
})
export class twoFactorAuthModule {}