import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { TwoFactorAuthService } from './twofactorauth.service';
import { TwoFactorAuthController } from './twofactorauth.controller';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [UsersModule],
  controllers: [TwoFactorAuthController],
  providers: [TwoFactorAuthService, JwtService],
})
export class twoFactorAuthModule {}