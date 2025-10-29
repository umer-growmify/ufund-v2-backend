import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminRoleType, RoleType as Role } from '@prisma/client';
import { Roles } from 'src/auth/guards/roles.decorator';
import { prfileFileConfig } from 'src/config/file-config';
import { RequestWithUser } from 'src/types/types';
import { FileValidationInterceptor } from 'src/utils/file-validation.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { ProfileService } from './profile.service';
import { UpdateProfileUserDto } from 'src/auth/dto/auth.dto';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create-and-update-profile')
  @ApiOperation({
    summary:
      'If the profile is not found then create a new profile; if found and input fields changed, update it (Investor, Campaigner)',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile created and updated successfully',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.investor, Role.campaigner)
  @UseInterceptors(
    FileInterceptor('image'), // Multer interceptor for a single file field named "profile"
    new FileValidationInterceptor(prfileFileConfig),
  )
  async createAndUpdateProfile(
    @Req() req: RequestWithUser,
    @Body() createProfile: CreateProfileDto,
    @Body() updateProfile: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    console.log('profiel ......................', userId);

    return this.profileService.createAndUpdateProfile(
      createProfile,
      updateProfile,
      userId,
      file,
    );
  }

  @Put('update-profile-user')
  @ApiOperation({
    summary: 'this will update the user in the profile page',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile created and updated successfully',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.investor, Role.campaigner)
  async updateProfileUser(
    @Req() req: RequestWithUser,
    @Body() updateProfileUserDto: UpdateProfileUserDto,
  ) {
    const userId = req.user.id;
    return this.profileService.updateProfileUser(userId, updateProfileUserDto);
  }

  @Put('update-profile-user-by-admin/:id')
  @ApiOperation({
    summary: 'the admin will update the user in the profile page',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile created and updated successfully',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async updateProfileUserByAdmin(
    @Param('id') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.profileService.updateCompleteProfile(
      userId,
      updateProfileDto,
      file,
    );
  }

  @Get('get-profile-by-id/:id')
  @ApiOperation({ summary: 'Get profile by user ID (Investor, Campaigner)' })
  @ApiResponse({ status: 200, description: 'Profile fetched successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  async getProfileById(@Param('id') userId: string) {
    const getProfile = await this.profileService.getProfile(userId);

    if (!getProfile) {
      throw new NotFoundException('Profile not found');
    }

    return getProfile;
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

  @Get('top-header-profile')
  @ApiOperation({ summary: 'Get profile top header (Investor, Campaigner)' })
  @ApiResponse({
    status: 200,
    description: 'Profile top header fetched successfully',
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.investor, Role.campaigner)
  async getProfileTopHeader(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    const activeRole = req.user.activeRole;

    const getProfileTopHeader = await this.profileService.getProfileTopHeader(
      userId,
      activeRole,
    );

    if (!getProfileTopHeader) {
      throw new NotFoundException('Profile not found');
    }

    return getProfileTopHeader;
  }

  // ###############################################################################

  @Post('create-or-update-full-profile')
  @ApiOperation({ summary: 'Create a new profile (Investor, Campaigner)' })
  @ApiResponse({ status: 200, description: 'Profile created successfully' })
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.investor, Role.campaigner)
  async createUpdateProfileUser(
    @Req() req: RequestWithUser,
    @Body() body: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log(
      'body ###########################################################',
      body,
    );

    const userId = req.user.id;
    console.log('body ', body);

    return this.profileService.createUpdateProfileUser(userId, body, file);
  }
}
