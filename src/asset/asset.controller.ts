import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminRoleType, RoleType } from '@prisma/client';
import {
  CreateAssetDto,
  CreateAssetTypeDto,
  CreateTokenTypeDto,
} from './dto/asset.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/types/types';
import { Roles } from 'src/auth/guards/roles.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileValidationInterceptor } from 'src/utils/file-validation.interceptor';
import { assetsFileConfig } from 'src/config/file-config';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post('asset-type')
  @ApiOperation({ summary: 'Create a asset Type (SUPER_ADMIN)' })
  @ApiResponse({ status: 201, description: 'Asset type created successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only  SUPER_ADMIN can create Asset Type',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  createAssetType(@Body() createAssetTypeDto: CreateAssetTypeDto) {
    return this.assetService.createAssetType(createAssetTypeDto);
  }

  @Post('token-type')
  @ApiOperation({ summary: 'Create a token Type (SUPER_ADMIN)' })
  @ApiResponse({ status: 201, description: 'token type created successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only  SUPER_ADMIN can create token Type',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  createTokenType(@Body() createTokenTypeDto: CreateTokenTypeDto) {
    return this.assetService.createTokenType(createTokenTypeDto);
  }

  @Post('create-campaigner-asset')
  @ApiOperation({ summary: 'Create a Asset (SUPER_ADMIN)' })
  @ApiResponse({ status: 201, description: 'Asset created successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only  SUPER_ADMIN or campaigner can create asset',
  })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.campaigner)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'auditorsReportKey', maxCount: 1 },
      { name: 'documentKey', maxCount: 1 },
      { name: 'productImageKey', maxCount: 1 },
      { name: 'assetImageKey', maxCount: 1 },
      { name: 'imageOneKey', maxCount: 1 },
      { name: 'imageTwoKey', maxCount: 1 },
    ]),
    new FileValidationInterceptor(assetsFileConfig),
  )
  createCampaignerAsset(
    @Body() createAssetDto: CreateAssetDto,
    @Req() req: RequestWithUser,
    @UploadedFiles()
    files: {
      auditorsReportKey: Express.Multer.File[];
      documentKey?: Express.Multer.File[];
      productImageKey: Express.Multer.File[];
      assetImageKey: Express.Multer.File[];
      imageOneKey?: Express.Multer.File[];
      imageTwoKey?: Express.Multer.File[];
    },
  ) {
    const id = req.user.id;
    const role = req.user.activeRole;
    console.log('role', role);
    return this.assetService.createCampaignerAsset(createAssetDto, id, files);
  }

  @Post('create-admin-asset')
  @ApiOperation({ summary: 'Create a Asset (SUPER_ADMIN)' })
  @ApiResponse({ status: 201, description: 'Asset created successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only  SUPER_ADMIN or campaigner can create asset',
  })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'auditorsReportKey', maxCount: 1 },
      { name: 'documentKey', maxCount: 1 },
      { name: 'productImageKey', maxCount: 1 },
      { name: 'assetImageKey', maxCount: 1 },
      { name: 'imageOneKey', maxCount: 1 },
      { name: 'imageTwoKey', maxCount: 1 },
    ]),
    new FileValidationInterceptor(assetsFileConfig),
  )
  createAdminAsset(
    @Body() createAssetDto: CreateAssetDto,
    @Req() req: RequestWithUser,
    @UploadedFiles()
    files: {
      auditorsReportKey: Express.Multer.File[];
      documentKey?: Express.Multer.File[];
      productImageKey: Express.Multer.File[];
      assetImageKey: Express.Multer.File[];
      imageOneKey?: Express.Multer.File[];
      imageTwoKey?: Express.Multer.File[];
    },
  ) {
    const id = req.user.id;
    const role = req.user.activeRole;
    console.log('role', role);
    return this.assetService.createAdminAsset(createAssetDto, id, files);
  }
}
