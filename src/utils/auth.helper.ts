// src/auth/utils/auth.helper.ts
import { UnauthorizedException } from '@nestjs/common';
import { RoleType, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as Mailgen from 'mailgen';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';


export async function sendVerificationEmail(
  email: string,
  token: string,
  firstName?: string,
  lastName?: string,
) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'uFund',
      link: process.env.BASE_URL || 'http://localhost:3000',
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
        instructions: 'To get started with uFund, please confirm your account:',
        button: {
          color: '#22BC66',
          text: 'Verify Your Email',
          link: `${process.env.BASE_URL}/api/v1/auth/verify/${token}`,
        },
      },
      outro: 'If you did not sign up for uFund, you can safely ignore this email.',
    },
  });

  await transporter.sendMail({
    from: process.env.MAILTRAP_SENDEREMAIL,
    to: email,
    subject: 'Welcome to uFund! Confirm Your Email',
    html: emailBody,
  });
}

// Token generation and cookie setting
export function generateTokenAndSetCookie(
  user: User,
  res: Response,
  rememberMe: boolean = true,
  activeRole: RoleType,
) {
  const payload = { 
    id: user.id, 
    email: user.email,
    roles: user.roles,
    activeRole,
    type: 'user'
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: rememberMe ? '7d' : '1d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
  });

  return {
    success: true,
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      roles: user.roles,
      activeRole,
    },
  };
}

export async function validateAdmin(prisma: PrismaService, email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  
  if (!admin) {
    throw new UnauthorizedException('Invalid credentials');
  }
  
  const passwordValid = await bcrypt.compare(password, admin.password);
  
  if (!passwordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }
  
  return admin;
}

