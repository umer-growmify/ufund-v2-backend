import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoleType as Role } from '@prisma/client';
import { RequestWithUser } from 'src/types/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/guards/roles.guard';
import { CreateProfileDto } from './dto/profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.investor, Role.campaigner)
  async createProfile(
    @Req() req: RequestWithUser, // Use the custom interface
    @Body() createProfileDto: CreateProfileDto,
  ) {
    // Ensure user is creating their own profile
    const userId = req.user.id;
    console.log(`Creating profile for user ID: ${userId}`);
    
    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const createProfile = this.profileService.createProfile(
      createProfileDto,
      userId,
    );
    if (!createProfile) {
      throw new NotFoundException('Profile not created');
    }
    return createProfile;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.investor, Role.campaigner)
  async getProfile(@Req() req: RequestWithUser) {
    // Use the custom interface
    const userId = req.user.id;

    const getProfile = await this.profileService.getProfile(userId);

    if (!getProfile) {
      throw new NotFoundException('Profile not found');
    }

    return getProfile;
  }
}
