import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  generateTokenAndSetCookie,
  sendVerificationEmail,
} from 'src/utils/auth.helper';
import { LoginDto, RegisterDto, SocialUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async registerUser(dto: RegisterDto) {
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      countryCode,
      password,
      repeatPassword,
      agreedToTerms,
      roles,
    } = dto;

    if (
      !email ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !countryCode ||
      !password ||
      !repeatPassword ||
      agreedToTerms === undefined ||
      !roles ||
      !roles.length
    ) {
      throw new BadRequestException('All fields are required.');
    }

    if (password !== repeatPassword) {
      throw new BadRequestException('Passwords do not match.');
    }
    if (password.length < 6 || repeatPassword.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long.',
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) throw new BadRequestException('Email already exists');
    if (!agreedToTerms)
      throw new BadRequestException('You must agree to the terms');

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        countryCode,
        phoneNumber,
        password: hashedPassword,
        roles, // Now storing array of roles
        agreedToTerms,
        isVerified: false,
        verificationToken,
      },
    });

    await sendVerificationEmail(
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

  async verifyUserEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user)
      throw new NotFoundException('Invalid or expired verification token');

    await this.prisma.user.update({
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

  async loginUser(dto: LoginDto, res: Response) {
    const { email, password, rememberMe, activeRole } = dto;

    if (!email || !password || !activeRole) {
      throw new BadRequestException('Credentials and role are required');
    }

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    if (!user.password) {
      throw new ForbiddenException('This account uses social login');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Add new role if not already present
    if (!user.roles.includes(activeRole)) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          roles: { set: [...user.roles, activeRole] },
        },
      });
    }

    return generateTokenAndSetCookie(user, res, rememberMe, activeRole);
  }

  async socialLogin(socialUser: SocialUserDto, res: Response) {
    const { email, provider, providerId, activeRole } = socialUser;

    // Check if social account already exists
    const existingSocialUser = await this.prisma.user.findFirst({
      where: {
        provider,
        providerId,
      },
    });

    if (existingSocialUser) {
      // Add new role if not already present
      if (!existingSocialUser.roles.includes(activeRole)) {
        const updatedUser = await this.prisma.user.update({
          where: { id: existingSocialUser.id },
          data: {
            roles: { set: [...existingSocialUser.roles, activeRole] },
          },
        });
        return generateTokenAndSetCookie(updatedUser, res, true, activeRole);
      }
      return generateTokenAndSetCookie(
        existingSocialUser,
        res,
        true,
        activeRole,
      );
    }

    // Check if email already exists (non-social account)
    const existingEmailUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingEmailUser) {
      throw new ConflictException(
        'Email already registered with another method',
      );
    }

    // Create new social user with active role
    const newUser = await this.prisma.user.create({
      data: {
        email,
        firstName: socialUser.firstName || '',
        lastName: socialUser.lastName || '',
        provider,
        providerId,
        roles: [activeRole], // Initialize with active role
        agreedToTerms: true,
        isVerified: true,
        verificationToken: null,
      },
    });

    return generateTokenAndSetCookie(newUser, res, true, activeRole);
  }
}
