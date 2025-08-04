import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoleType as Role } from '@prisma/client';
import { RequestWithUser } from 'src/types/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { ProfileService } from './profile.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileValidationInterceptor } from 'src/utils/file-validation.interceptor';
import { prfileFileConfig } from 'src/config/file-config';
import { Roles } from 'src/auth/guards/roles.decorator';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create profile (Investor, Campaigner)' })
  @ApiResponse({ status: 201, description: 'Profile created successfully' })
  @ApiResponse({
    status: 404,
    description: 'User not found or profile not created',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profile data and optional image file',
    type: CreateProfileDto,
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.investor, Role.campaigner)
  @UseInterceptors(
    FileInterceptor('image'),
    new FileValidationInterceptor(prfileFileConfig),
  )
  async createProfile(
    @Req() req: RequestWithUser,
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    console.log(`Creating profile for user ID: ${userId}`);

    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const createProfile = await this.profileService.createProfile(
      createProfileDto,
      userId,
      file,
    );

    if (!createProfile) {
      throw new NotFoundException('Profile not created');
    }
    return createProfile;
  }

  @Put('update')
  @ApiOperation({ summary: 'Update profile (Investor, Campaigner)' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({
    status: 404,
    description: 'User not found or profile not found',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profile data and optional image file for update',
    type: UpdateProfileDto,
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.investor, Role.campaigner)
  @UseInterceptors(
    FileInterceptor('image'),
    new FileValidationInterceptor(prfileFileConfig),
  )
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    console.log(`Updating profile for user ID: ${userId}`);

    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const updatedProfile = await this.profileService.updateProfile(
      updateProfileDto,
      userId,
      file,
    );

    if (!updatedProfile) {
      throw new NotFoundException('Profile not updated');
    }
    return updatedProfile;
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

  @Get('image')
  @ApiOperation({ summary: 'Get signed URL for profile image (Investor, Campaigner)' })
  @ApiResponse({ status: 200, description: 'Signed URL generated successfully' })
  @ApiResponse({ status: 404, description: 'Profile image not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.investor, Role.campaigner)
  async getProfileImage(@Req() req: RequestWithUser) {
    const userId = req.user.id;

    const getProfileImage = await this.profileService.getProfileImage(userId);

    if (!getProfileImage) {
      throw new NotFoundException('Profile image not found');
    }

    return getProfileImage;
  }

  @Get('top-header-profile')
  @ApiOperation({ summary: 'Get profile top header (Investor, Campaigner)' })
  @ApiResponse({ status: 200, description: 'Profile top header fetched successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.investor, Role.campaigner)
  async getProfileTopHeader(
    @Req() req: RequestWithUser,
  ) {
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
}