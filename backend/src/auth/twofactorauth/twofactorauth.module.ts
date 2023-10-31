import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { TwoFactorAuthService } from './twofactorauth.service';
import { TwoFactorAuthController } from './twofactorauth.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { TwoFaStrategy } from './guard/2fa.strategy';
import { PassportModule } from '@nestjs/passport';
import { TwoFaAuthGuard } from './guard/2fa.guard';



@Module({
  imports: [UsersModule,
      PassportModule.register({ defaultStrategy: '2fa' }),
    ],
  controllers: [TwoFactorAuthController],
  providers: [TwoFactorAuthService, JwtService, AuthService, UsersService, TwoFaStrategy, TwoFaAuthGuard],
  // providers: [TwoFactorAuthService, JwtService, AuthService, UsersService, TwoFaStrategy],
})
export class twoFactorAuthModule {}