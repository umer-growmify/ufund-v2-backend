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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create profile (Investor, Campaigner)' })
  @ApiResponse({ status: 201, description: 'Profile created successfully' })
  @ApiResponse({ status: 404, description: 'User not found or profile not created' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.investor, Role.campaigner)
  async createProfile(
    @Req() req: RequestWithUser,
    @Body() createProfileDto: CreateProfileDto,
  ) {
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
  @ApiOperation({ summary: 'Get your own profile (Investor, Campaigner)' })
  @ApiResponse({ status: 200, description: 'Profile fetched successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.investor, Role.campaigner)
  async getProfile(@Req() req: RequestWithUser) {
    const userId = req.user.id;

    const getProfile = await this.profileService.getProfile(userId);

    if (!getProfile) {
      throw new NotFoundException('Profile not found');
    }

    return getProfile;
  }
}
