import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoginDto, RegisterDto, SocialUserDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

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

  // Social login endpoints
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    await this.authService.socialLogin(user, res);
    this.redirectToFrontend(res);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookAuth() {
    // Initiates Facebook OAuth flow
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    await this.authService.socialLogin(user, res);
    this.redirectToFrontend(res);
  }

  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  linkedinAuth() {
    // Initiates LinkedIn OAuth flow
  }

  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    await this.authService.socialLogin(user, res);
    this.redirectToFrontend(res);
  }

  @Get('twitter')
  @UseGuards(AuthGuard('twitter')) // <-- Twitter OAuth 2.0
  twitterAuth() {
    // This route redirects to Twitter
  }

  @Get('twitter/callback')
  @UseGuards(AuthGuard('twitter'))
  async twitterAuthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    await this.authService.socialLogin(user, res);
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