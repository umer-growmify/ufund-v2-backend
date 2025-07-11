import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { RolesGuard } from './guards/roles.guard';

import { PrismaModule } from '../prisma/prisma.module';
import {
  FacebookStrategy,
  GoogleStrategy,
  JwtStrategy,
  LinkedInStrategy,
  TwitterStrategy,
} from './strategies/auth.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(), // For using .env variables
    PrismaModule, // If using Prisma inside AuthService
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
    GoogleStrategy,
    FacebookStrategy,
    LinkedInStrategy,
    TwitterStrategy,
    {
      provide: 'ROLES_GUARD',
      useClass: RolesGuard,
    },
  ],
  exports: [
    JwtStrategy,
    PassportModule,
    JwtModule,
    {
      provide: 'ROLES_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
