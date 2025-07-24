import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Res,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RoleType as Role } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Auth') // Grouped under "Auth" tag
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  register(@Body() dto: RegisterDto) {
    return this.authService.registerUser(dto);
  }

  @Get('check')
  @UseGuards(AuthGuard('jwt')) // Requires valid JWT
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check authentication status' })
  @ApiResponse({ status: 200, description: 'Returns current user data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkAuth(@Req() req: Request) {
    console.log('Checking auth for user:', req.user);

    return this.authService.checkAuth(req.user);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt')) // Requires valid JWT
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logOutUser(res);
  }

  @Get('verify/:token')
  @ApiOperation({ summary: 'Verify user email using token' })
  @ApiParam({ name: 'token', description: 'Verification token from email' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  verifyEmail(@Param('token') token: string) {
    return this.authService.verifyUserEmail(token);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login with email and password' })
  @ApiResponse({ status: 201, description: 'Login successful with JWT token' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.loginUser(dto, res);
  }

  @Get('google')
  @ApiOperation({ summary: 'Google OAuth login (redirects to Google)' })
  @ApiQuery({
    name: 'role',
    enum: Role,
    required: true,
    description: 'Role type (investor, campaigner)',
  })
  @UseGuards(AuthGuard('google'))
  googleAuth(@Query('role') role: Role) {}

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback (handled automatically)' })
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const activeRole = (req.query.state as Role) || 'investor';
    await this.authService.socialLogin({ ...user, activeRole }, res);
    this.redirectToFrontend(res);
  }

  @Get('facebook')
  @ApiOperation({ summary: 'Facebook OAuth login (redirects to Facebook)' })
  @ApiQuery({
    name: 'role',
    enum: Role,
    required: true,
    description: 'Role type (investor, campaigner)',
  })
  @UseGuards(AuthGuard('facebook'))
  facebookAuth(@Query('role') role: Role) {}

  @Get('facebook/callback')
  @ApiOperation({ summary: 'Facebook OAuth callback (handled automatically)' })
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const activeRole = (req.query.state as Role) || 'investor';
    await this.authService.socialLogin({ ...user, activeRole }, res);
    this.redirectToFrontend(res);
  }

  @Get('linkedin')
  @ApiOperation({ summary: 'LinkedIn OAuth login (redirects to LinkedIn)' })
  @ApiQuery({
    name: 'role',
    enum: Role,
    required: true,
    description: 'Role type (investor, campaigner)',
  })
  @UseGuards(AuthGuard('linkedin'))
  linkedinAuth(@Query('role') role: Role) {}

  @Get('linkedin/callback')
  @ApiOperation({ summary: 'LinkedIn OAuth callback (handled automatically)' })
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const activeRole = (req.query.state as Role) || 'investor';
    await this.authService.socialLogin({ ...user, activeRole }, res);
    this.redirectToFrontend(res);
  }

  @Get('twitter')
  @ApiOperation({ summary: 'Twitter OAuth login (redirects to Twitter)' })
  @ApiQuery({
    name: 'role',
    enum: Role,
    required: true,
    description: 'Role type (investor, campaigner)',
  })
  @UseGuards(AuthGuard('twitter'))
  twitterAuth(@Query('role') role: Role) {}

  @Get('twitter/callback')
  @ApiOperation({ summary: 'Twitter OAuth callback (handled automatically)' })
  @UseGuards(AuthGuard('twitter'))
  async twitterAuthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const activeRole = (req.query.state as Role) || 'investor';
    await this.authService.socialLogin({ ...user, activeRole }, res);
    this.redirectToFrontend(res);
  }

  private redirectToFrontend(res: Response) {
    const redirectUrl = process.env.FRONTEND_REDIRECT_URL;
    if (!redirectUrl) {
      throw new Error('Frontend redirect URL is not configured');
    }
    return res.redirect(redirectUrl);
  }
}
