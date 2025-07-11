import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.guard';
import { RoleType as Role } from '@prisma/client';
import { Request } from 'express';
import { CreateProfileDto } from './dto/profile.dto';

// Add this interface to define the user object structure
interface RequestWithUser extends Request {
  user: {
    id: string;
    roles: Role[];
    activeRole: Role;
  };
}

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
    console.log(`Fetching profile for user ID: ${userId}`);

    if (!userId ) {
      throw new NotFoundException('User not found');
    }

    

    return this.profileService.createProfile(createProfileDto, userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.investor, Role.campaigner)
  async getProfile(@Req() req: RequestWithUser) {
    // Use the custom interface
    const userId = req.user.id;
    console.log(`Fetching profile for user ID: ${userId}`);
    
    const profile = await this.profileService.getProfile(userId);

    // if (!profile) {
    //   throw new NotFoundException('Profile not found');
    // }

    return profile;
  }
}
