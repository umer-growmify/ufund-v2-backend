/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import e, { Response } from 'express';
import * as Mailgen from 'mailgen';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { RoleType, AdminRoleType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthHelperService {
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async sendVerificationEmail(
    email: string,
    token: string,
    firstName?: string,
    lastName?: string,
  ): Promise<void> {
    const verifyUrl = `${this.configService.get('BASE_URL')}/api/v1/auth/verify/${token}`;
    console.log('verifyUrl:', verifyUrl);

    await this.emailService.send({
      templateId: 'UFUND_AUTH_EMAIL_VERIFICATION_EN',
      to: email,
      variables: {
        firstName: firstName || email.split('@')[0],
        lastName: lastName ?? '',
        verificationUrl: verifyUrl,
        expirationHours: 24,
      },
    });
  }

  async sendWelcomeEmail(
    email: string,
    firstName?: string,
    lastName?: string,
  ): Promise<void> {
    const dashboardUrl = this.configService.get('DASHBOARD_URL') || 'https://web.ufund.online/dashboard';
    
    await this.emailService.send({
      templateId: 'UFUND_WELCOME_EMAIL_EN',
      to: email,
      variables: {
        firstName: firstName || email.split('@')[0],
        lastName: lastName ?? '',
        dashboardUrl: dashboardUrl,
      },
    });
  }

  generateTokenAndSetCookie(
    entity: {
      id: string;
      email: string;
      roles: (RoleType | AdminRoleType)[];
      name?: string;
    },
    res: Response,
    rememberMe: boolean,
    activeRole: RoleType | AdminRoleType,
    tokens: { accessToken: string; refreshToken: string; cookieName?: string },
  ) {
    const { accessToken, refreshToken } = tokens;

    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'none',
      domain: '.ufund.online',
      maxAge: 2 * 60 * 1000, // 5 minutes
    });

    const defaultExpiry = 7 * 24 * 60 * 60 * 1000;
    const refreshTokenExpiryStr = this.configService.get(
      'REFRESH_TOKEN_EXPIRY',
    );
    const refreshTokenExpiry = refreshTokenExpiryStr
      ? parseInt(refreshTokenExpiryStr, 10)
      : defaultExpiry;

    console.log('Setting cookie: refreshToken', {
      value: refreshToken,
      maxAge: rememberMe ? refreshTokenExpiry : 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'none',
      maxAge: rememberMe ? refreshTokenExpiry : 24 * 60 * 60 * 1000,
      path: '/api/v1/auth/refresh',
    });

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: entity.id,
        email: entity.email,
        name: entity.name,
        roles: entity.roles,
        activeRole,
      },
    };
  }

  async validateAdmin(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, admin.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return admin;
  }
}