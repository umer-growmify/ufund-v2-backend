import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import * as Mailgen from 'mailgen';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcryptjs';
import { RoleType, AdminRoleType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthHelperService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) { }

  async sendVerificationEmail(
    email: string,
    token: string,
    firstName?: string,
    lastName?: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: this.configService.get('MAILTRAP_HOST'),
      port: Number(this.configService.get('MAILTRAP_PORT')),
      auth: {
        user: this.configService.get('MAILTRAP_USERNAME'),
        pass: this.configService.get('MAILTRAP_PASSWORD'),
      },
    });

    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'uFund',
        link: this.configService.get('BASE_URL') || 'http://localhost:3000',
        copyright: `© ${new Date().getFullYear()} uFund. All rights reserved.`,
      },
    });

    const emailBody = mailGenerator.generate({
      body: {
        name: firstName || email.split('@')[0],
        intro: [
          'Welcome to uFund!',
          'One Platform to Power Your Investment Journey!',
        ],
        action: {
          instructions:
            'To get started with uFund, please confirm your account:',
          button: {
            color: '#22BC66',
            text: 'Verify Your Email',
            link: `${this.configService.get('BASE_URL')}/api/v1/auth/verify/${token}`,
          },
        },
        outro:
          'If you did not sign up for uFund, you can safely ignore this email.',
      },
    });

    await transporter.sendMail({
      from: this.configService.get('MAILTRAP_SENDEREMAIL'),
      to: email,
      subject: 'Welcome to uFund! Confirm Your Email',
      html: emailBody,
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
      sameSite: 'lax',
      maxAge: 1 * 60 * 1000, // 1 minutes
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
      sameSite: 'lax',
      maxAge: rememberMe ? refreshTokenExpiry : 24 * 60 * 60 * 1000,
      path: '/api/v1/auth/refresh'
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
