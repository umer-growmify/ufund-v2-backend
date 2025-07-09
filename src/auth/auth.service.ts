import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import * as Mailgen from 'mailgen';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
@Injectable()
export class AuthService {
  async registerUser(dto: RegisterDto) {
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      password,
      repeatPassword,
      agreedToTerms,
      role,
    } = dto;

    if (
      !email ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !password ||
      !repeatPassword ||
      agreedToTerms === undefined ||
      !role
    ) {
      throw new BadRequestException('All fields are required.');
    }

    if (password !== repeatPassword) {
      throw new BadRequestException('Passwords do not match .');
    }
    if (password.length < 6 && repeatPassword.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long.',
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) throw new BadRequestException('Email already exists');
    if (!agreedToTerms)
      throw new BadRequestException('You must agree to the terms');

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        phoneNumber,
        password: hashedPassword,
        role,
        agreedToTerms,
        isVerified: false,
        verificationToken,
      },
    });

    await this.sendVerificationEmail(
      user.email,
      verificationToken,
      user.firstName,
      user.lastName,
    );

    return {
      success: true,
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  async sendVerificationEmail(
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
        name: email.split('@')[0], // Or use full name if available
        intro: [
          'Welcome to uFund!',
          'One Platform to Power Your Investment Journey!',
        ],
        action: {
          instructions:
            'To get started with uFund, please confirm your account:',
          button: {
            color: '#22BC66', // Optional: uFund brand color
            text: 'Verify Your Email',
            link: `${process.env.BASE_URL}/api/v1/auth/verify/${token}`,
          },
        },
        outro:
          'If you did not sign up for uFund, you can safely ignore this email.',
      },
    });

    await transporter.sendMail({
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: email,
      subject: 'Welcome to uFund! Confirm Your Email',
      html: emailBody,
    });
  }

  async verifyUserEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user)
      throw new NotFoundException('Invalid or expired verification token');

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    return {
      success: true,
      message: 'Email verified successfully!',
    };
  }

  async loginUser(dto: LoginDto, res: any) {
    const { email, password, rememberMe } = dto;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? '7d' : '1d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 30 days or 1 day
    });



    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
      },
    };
  }
}
