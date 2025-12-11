/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/auth/auth.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import {
  LoginDto,
  RegisterDto,
  SocialUserDto,
  AdminLoginDto,
} from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { RoleType, AdminRoleType } from '@prisma/client';
import { AuthHelperService } from 'src/utils/auth.helper';
import { userInfo } from 'os';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly authHelper: AuthHelperService,
  ) {}

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
      !roles ||
      !roles.every((role) => Object.values(RoleType).includes(role))
    ) {
      throw new BadRequestException('Invalid role(s) provided');
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new BadRequestException(
        'Password must be at least 8 characters long and include uppercase, lowercase, and a number',
      );
    }

    if (password !== repeatPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    if (!agreedToTerms) {
      throw new BadRequestException('You must agree to the terms');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Registration failed');
    }

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    let user;

    try {
      // Create user inside a transaction
      user = await this.prisma.$transaction(async (prisma) => {
        const newUser = await prisma.user.create({
          data: {
            email,
            firstName,
            lastName,
            countryCode,
            phoneNumber,
            password: hashedPassword,
            roles,
            agreedToTerms,
            isVerified: false,
            verificationToken,
          },
        });
        return newUser;
      });

      // Attempt to send verification email
      await this.authHelper.sendVerificationEmail(
        user.email,
        verificationToken,
        user.firstName,
        user.lastName,
      );
    } catch (error) {
      // Rollback User creation if email fails
      if (user) {
        await this.prisma.user.delete({ where: { id: user.id } });
      }
      throw new InternalServerErrorException(
        'Registration failed: unable to send verification email. ' +
          error.message,
      );
    }

    return {
      success: true,
      message: 'Registration successful. Please verify your email.',
    };
  }

  async loginUser(dto: LoginDto, res: Response) {
    const { email, password, rememberMe, activeRole } = dto;

    if (!Object.values(RoleType).includes(activeRole)) {
      throw new BadRequestException('Invalid role provided');
    }
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isVerified || !user.password) {
      throw new UnauthorizedException(
        'Invalid credentials or unverified email',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isInvestor = user.roles.includes(RoleType.investor);
    const isCampaigner = user.roles.includes(RoleType.campaigner);
    let userinfo: any = null;
    if (activeRole === RoleType.campaigner && !isCampaigner) {
      // DO NOT add campaigner role in DB
      userinfo = {
        success: false,
        reason: 'REQUEST_SECOND_ROLE',
        userInfo: { userId: user.id },
        message: 'You can become a campaigner. Select type.',
        options: ['INDIVIDUAL', 'COMPANY'],
      };
    } else if (activeRole === RoleType.investor && !isInvestor) {
      console.log('User:', user);

      if (!user.roles.includes(activeRole)) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { roles: { set: [...user.roles, activeRole] } },
        });
      }
    }
    const { accessToken, refreshToken } = await this.generateTokens(
      user,
      activeRole,
    );
    // Delete old token and create new one (use deleteMany to avoid errors if token was already removed)
    await this.prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        activeRole: [activeRole],
        expiresAt: new Date(
          Date.now() +
            Number(
              this.configService.get(
                'REFRESH_TOKEN_EXPIRY',
                7 * 24 * 60 * 60 * 1000,
              ),
            ),
        ),
      },
    });

    this.authHelper.generateTokenAndSetCookie(
      user,
      res,
      rememberMe ?? false,
      activeRole,
      {
        accessToken,
        refreshToken,
      },
    );

    return { success: true, userinfo, message: 'Login successful', activeRole };
  }

  async adminLogin(dto: AdminLoginDto, res: Response) {
    const { email, password } = dto;

    const admin = await this.authHelper.validateAdmin(email, password);

    if (!admin.role) {
      throw new BadRequestException('Admin has no role assigned');
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      admin,
      admin.role,
    );
    const adminActiveRole = admin.role;
    await this.prisma.refreshToken.deleteMany({ where: { userId: admin.id } });
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        adminId: admin.id,
        adminActiveRole: [adminActiveRole],
        expiresAt: new Date(
          Date.now() +
            Number(
              this.configService.get(
                'REFRESH_TOKEN_EXPIRY',
                7 * 24 * 60 * 60 * 1000,
              ),
            ),
        ),
      },
    });

    this.authHelper.generateTokenAndSetCookie(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        roles: [admin.role],
      },
      res,
      true,
      admin.role,
      { accessToken, refreshToken, cookieName: 'admin_token' },
    );

    return {
      success: true,
      message: 'Admin login successful',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        activeRole: admin.role,
      },
    };
  }

  async socialLogin(socialUser: SocialUserDto, res: Response) {
    const { email, provider, providerId, activeRole, firstName, lastName } =
      socialUser;

    if (!Object.values(RoleType).includes(activeRole)) {
      throw new BadRequestException('Invalid role provided');
    }

    const existingSocialUser = await this.prisma.user.findFirst({
      where: { provider, providerId },
    });

    if (existingSocialUser) {
      if (!existingSocialUser.roles.includes(activeRole)) {
        await this.prisma.user.update({
          where: { id: existingSocialUser.id },
          data: { roles: { set: [...existingSocialUser.roles, activeRole] } },
        });
      }

      const { accessToken, refreshToken } = await this.generateTokens(
        existingSocialUser,
        activeRole,
      );
      this.authHelper.generateTokenAndSetCookie(
        existingSocialUser,
        res,
        true,
        activeRole,
        {
          accessToken,
          refreshToken,
        },
      );

      return { success: true, message: 'Social login successful' };
    }

    const existingEmailUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingEmailUser) {
      throw new ConflictException('Email already registered');
    }

    const newUser = await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email,
          firstName: firstName || '',
          lastName: lastName || '',
          provider,
          providerId,
          roles: [activeRole],
          agreedToTerms: true,
          isVerified: true,
          verificationToken: null,
        },
      });

      const refreshToken = crypto.randomBytes(64).toString('hex');
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(
            Date.now() +
              Number(
                this.configService.get(
                  'REFRESH_TOKEN_EXPIRY',
                  7 * 24 * 60 * 60 * 1000,
                ),
              ),
          ),
        },
      });

      return user;
    });

    const { accessToken, refreshToken } = await this.generateTokens(
      newUser,
      activeRole,
    );

    this.authHelper.generateTokenAndSetCookie(newUser, res, true, activeRole, {
      accessToken,
      refreshToken,
    });

    return { success: true, message: 'Social login successful' };
  }

  async logOutUser(res: Response, userId: string, isAdmin: boolean = false) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId, adminId: isAdmin ? userId : null },
    });

    console.log(isAdmin);

    const cookieName = isAdmin ? 'admin_token' : 'accessToken';
    res.clearCookie(cookieName, {
      httpOnly: false,
      secure: this.configService.get('NODE_ENV') === 'production',
      // domain: '.ufund.online',
      sameSite: 'none',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'none',
      path: '/api/v1/auth/refresh',
    });

    return { success: true, message: 'Logged out successfully' };
  }

  async verifyUserEmail(token: string) {
  const user = await this.prisma.user.findFirst({
    where: { verificationToken: token },
  });

  if (!user) {
    throw new NotFoundException('Invalid or expired verification token');
  }

  await this.prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true, verificationToken: null },
  });

  // Send welcome email AFTER verification
  await this.authHelper.sendWelcomeEmail(user.email, user.firstName, user.lastName);

  return { success: true, message: 'Email verified successfully' };
}


  async checkAuth(user: any) {
    if (!user || !user.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    // console.log('User:', user);

    const userData = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        countryCode: true,
        roles: true,
        isVerified: true,
        agreedToTerms: true,
      },
    });

    if (!userData) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      user: {
        ...userData,
        activeRole: user.activeRole,
      },
    };
  }

  async checkAuthAdmin(user: any) {
    if (!user || !user.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    console.log('User:', user);

    const userData = await this.prisma.admin.findUnique({
      where: { id: user.id },
    });

    if (!userData) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      user,
    };
  }

  async refreshToken(
    refreshToken: string,
    // activeRole: RoleType | AdminRoleType,
    res: Response,
  ) {
    console.log('refreshToken ', refreshToken);

    return this.prisma.$transaction(async (prisma) => {
      // First, try to find a refresh token for a user
      const userToken = await prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          expiresAt: { gt: new Date() }, // Check expiration
        },
        include: { user: true },
      });

      console.log('userToken', userToken);

      // If not found, try to find a refresh token for an admin
      const adminToken = !userToken
        ? await prisma.refreshToken.findFirst({
            where: {
              token: refreshToken,
              adminId: { not: null },
              expiresAt: { gt: new Date() }, // Check expiration
            },
            include: { admin: true },
          })
        : null;

      if (userToken) {
        // User token logic
        if (!userToken.user) {
          throw new UnauthorizedException('User not found for refresh token');
        }

        console.log('Token is here ...........', userToken.user);

        const { accessToken, refreshToken: newRefreshToken } =
          await this.generateTokens(userToken.user, userToken.activeRole[0]);
        const activeRole = userToken.activeRole[0];
        // Delete old token and create new one (use deleteMany to avoid errors if token was already removed)
        await prisma.refreshToken.deleteMany({ where: { id: userToken.id } });
        await prisma.refreshToken.create({
          data: {
            token: newRefreshToken,
            userId: userToken.userId,
            activeRole: [activeRole as RoleType],
            expiresAt: new Date(
              Date.now() +
                Number(
                  this.configService.get(
                    'REFRESH_TOKEN_EXPIRY',
                    7 * 24 * 60 * 60 * 1000,
                  ),
                ),
            ),
          },
        });

        this.authHelper.generateTokenAndSetCookie(
          {
            id: userToken.user.id,
            email: userToken.user.email,
            roles: userToken.user.roles,
            name: `${userToken.user.firstName} ${userToken.user.lastName}`,
          },
          res,
          true,
          activeRole,
          {
            accessToken,
            refreshToken: newRefreshToken,
            cookieName: 'accessToken',
          },
        );
      } else if (adminToken) {
        // Admin token logic
        if (!adminToken.admin) {
          throw new UnauthorizedException('Admin not found for refresh token');
        }

        const { accessToken, refreshToken: newRefreshToken } =
          await this.generateTokens(adminToken.admin, adminToken.admin.role);
        const activeRole = adminToken.admin.role;
        // Delete old token and create new one (use deleteMany to avoid errors if token was already removed)
        await prisma.refreshToken.deleteMany({ where: { id: adminToken.id } });
        await prisma.refreshToken.create({
          data: {
            token: newRefreshToken,
            adminId: adminToken.adminId,
            activeRole: [activeRole as RoleType],
            expiresAt: new Date(
              Date.now() +
                Number(
                  this.configService.get(
                    'REFRESH_TOKEN_EXPIRY',
                    7 * 24 * 60 * 60 * 1000,
                  ),
                ),
            ),
          },
        });

        this.authHelper.generateTokenAndSetCookie(
          {
            id: adminToken.admin.id,
            email: adminToken.admin.email,
            roles: [adminToken.admin.role],
            name: adminToken.admin.name,
          },
          res,
          true,
          adminToken.admin.role,
          {
            accessToken,
            refreshToken: newRefreshToken,
            cookieName: 'admin_token',
          },
        );
      } else {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      return { success: true, message: 'Token refreshed successfully' };
    });
  }
  private async generateTokens(
    entity: any,
    activeRole: RoleType | AdminRoleType,
  ) {
    const payload = {
      sub: entity.id,
      email: entity.email,
      role: activeRole,
      type: entity.role ? 'admin' : 'user',
    };

    const accessTokenEx = this.configService.get<number>(
      'ACCESS_TOKEN_EXPIRY',
      2 * 60 * 1000,
    ); // Use .env variable

    const accessToken = await this.generateJwt(payload, accessTokenEx);
    const refreshToken = crypto.randomBytes(64).toString('hex');

    return { accessToken, refreshToken };
  }

  private async generateJwt(payload: any, expiresIn: number) {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign(payload, secret, { expiresIn });
  }
}