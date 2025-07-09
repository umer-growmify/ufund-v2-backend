import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { FacebookStrategy, GoogleStrategy, LinkedInStrategy, TwitterStrategy } from './strategies/auth.strategy';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    FacebookStrategy,
    LinkedInStrategy,
    TwitterStrategy,
  ],
})
export class AuthModule {}