import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AssetService } from './asset.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {  RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminRoleType, RoleType } from '@prisma/client';
import { CreateAssetDto, CreateAssetTypeDto, CreateTokenTypeDto } from './dto/asset.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/types/types';
import { Roles } from 'src/auth/guards/roles.decorator';

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

  @Post('create')
  @ApiOperation({ summary: 'Create a Asset (SUPER_ADMIN)' })
  @ApiResponse({ status: 201, description: 'Asset created successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only  SUPER_ADMIN or campaigner can create asset',
  }) 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN, RoleType.campaigner)
  createAsset(@Body() createAssetDto: CreateAssetDto,@Req() req: RequestWithUser,) {
     const id = req.user.id;
    return this.assetService.createAsset(createAssetDto,id);
  }
}
