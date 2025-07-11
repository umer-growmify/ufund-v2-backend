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
import { LoginDto, RegisterDto, SocialUserDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RoleType as Role } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.registerUser(dto);
  }

  @Get('verify/:token')
  verifyEmail(@Param('token') token: string) {
    return this.authService.verifyUserEmail(token);
  }

  @Post('login')
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.loginUser(dto, res);
  }

  // Social login endpoints with activeRole query parameter
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth(@Query('role') role: Role) {
    // Initiates Google OAuth flow with role
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const activeRole = req.query.state as Role || 'investor';
    
    await this.authService.socialLogin({ 
      ...user, 
      activeRole: activeRole as Role 
    }, res);
    
    this.redirectToFrontend(res);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookAuth(@Query('role') role: Role) {
    // Initiates Facebook OAuth flow with role
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const activeRole = req.query.state as Role || 'investor';
    
    await this.authService.socialLogin({ 
      ...user, 
      activeRole: activeRole as Role 
    }, res);
    
    this.redirectToFrontend(res);
  }

  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  linkedinAuth(@Query('role') role: Role) {
    // Initiates LinkedIn OAuth flow with role
  }

  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const activeRole = req.query.state as Role || 'investor';
    
    await this.authService.socialLogin({ 
      ...user, 
      activeRole: activeRole as Role 
    }, res);
    
    this.redirectToFrontend(res);
  }

  @Get('twitter')
  @UseGuards(AuthGuard('twitter'))
  twitterAuth(@Query('role') role: Role) {
    // Initiates Twitter OAuth flow with role
  }

  @Get('twitter/callback')
  @UseGuards(AuthGuard('twitter'))
  async twitterAuthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const activeRole = req.query.state as Role || 'investor';
    
    await this.authService.socialLogin({ 
      ...user, 
      activeRole: activeRole as Role 
    }, res);
    
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