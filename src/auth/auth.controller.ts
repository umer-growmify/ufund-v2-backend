import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { RoleType } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AdminLoginDto, LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.registerUser(dto);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @ApiOperation({ summary: 'User login with email and password' })
  @ApiResponse({ status: 201, description: 'Login successful with JWT token' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginUser(dto, res);
  }

  @Post('admin/login')
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @ApiOperation({ summary: 'Admin login with email and password' })
  @ApiResponse({ status: 201, description: 'Admin login successful' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  async adminLogin(
    @Body() dto: AdminLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.adminLogin(dto, res);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user or admin' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as any;
    return this.authService.logOutUser(res, user.id, user.userType === 'admin');
  }

  @Get('check')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check authentication status' })
  @ApiResponse({ status: 200, description: 'Returns current user data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkAuth(@Req() req: Request) {
    console.log('checking auth status...', req);

    console.log('Checking auth for user:');
    return this.authService.checkAuth(req.user);
  }

  @Get('check-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check authentication status' })
  @ApiResponse({ status: 200, description: 'Returns current user data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkAuthAdmin(@Req() req: Request) {
    console.log('checking auth status...', req);

    console.log('Checking auth for user:');
    return this.authService.checkAuthAdmin(req.user);
  }

  @Get('verify/:token')
  @ApiOperation({ summary: 'Verify user email using token' })
  @ApiQuery({ name: 'token', description: 'Verification token from email' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyUserEmail(token);
  }

  @Post('refresh')
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('Refreshing token...', req);

    const refreshToken = req?.cookies?.refreshToken;

    if (!refreshToken) {
      console.log('No refresh token found in cookies');
    }

    return this.authService.refreshToken(refreshToken, res);
  }

  @Get('google')
  @ApiOperation({ summary: 'Google OAuth login (redirects to Google)' })
  @ApiQuery({ name: 'role', enum: RoleType, required: true })
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Query('role') role: RoleType) {}

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    const activeRole = req.query.role as RoleType;
    if (!Object.values(RoleType).includes(activeRole)) {
      throw new BadRequestException('Invalid role provided');
    }
    await this.authService.socialLogin({ ...user, activeRole }, res);
    this.redirectToFrontend(res);
  }

  @Get('facebook')
  @ApiOperation({ summary: 'Facebook OAuth login (redirects to Facebook)' })
  @ApiQuery({ name: 'role', enum: RoleType, required: true })
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Query('role') role: RoleType) {}

  @Get('facebook/callback')
  @ApiOperation({ summary: 'Facebook OAuth callback' })
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    const activeRole = req.query.role as RoleType;
    if (!Object.values(RoleType).includes(activeRole)) {
      throw new BadRequestException('Invalid role provided');
    }
    await this.authService.socialLogin({ ...user, activeRole }, res);
    this.redirectToFrontend(res);
  }

  @Get('linkedin')
  @ApiOperation({ summary: 'LinkedIn OAuth login (redirects to LinkedIn)' })
  @ApiQuery({ name: 'role', enum: RoleType, required: true })
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuth(@Query('role') role: RoleType) {}

  @Get('linkedin/callback')
  @ApiOperation({ summary: 'LinkedIn OAuth callback' })
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    const activeRole = req.query.role as RoleType;
    if (!Object.values(RoleType).includes(activeRole)) {
      throw new BadRequestException('Invalid role provided');
    }
    await this.authService.socialLogin({ ...user, activeRole }, res);
    this.redirectToFrontend(res);
  }

  @Get('twitter')
  @ApiOperation({ summary: 'Twitter OAuth login (redirects to Twitter)' })
  @ApiQuery({ name: 'role', enum: RoleType, required: true })
  @UseGuards(AuthGuard('twitter'))
  async twitterAuth(@Query('role') role: RoleType) {}

  @Get('twitter/callback')
  @ApiOperation({ summary: 'Twitter OAuth callback' })
  @UseGuards(AuthGuard('twitter'))
  async twitterAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    const activeRole = req.query.role as RoleType;
    if (!Object.values(RoleType).includes(activeRole)) {
      throw new BadRequestException('Invalid role provided');
    }
    await this.authService.socialLogin({ ...user, activeRole }, res);
    this.redirectToFrontend(res);
  }

  private redirectToFrontend(res: Response) {
    const redirectUrl = this.configService.get('FRONTEND_REDIRECT_URL');
    if (!redirectUrl) {
      throw new Error('Frontend redirect URL is not configured');
    }
    return res.redirect(redirectUrl);
  }
}
