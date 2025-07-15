import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AssetTypeService } from './asset-type.service';
import { CreateAssetTypeDto } from './dto/assetType.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles, RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminRoleType, RoleType } from '@prisma/client';

@Controller('asset-type')
export class AssetTypeController {
  constructor(private readonly assetTypeService: AssetTypeService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  createAssetType(@Body() createAssetTypeDto: CreateAssetTypeDto) {
    return this.assetTypeService.createAssetType(createAssetTypeDto);
  }

  @Get('getallassettype')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN, RoleType.campaigner)
  async getAllAssetType() {
    return this.assetTypeService.getAllAssetType();
  }
}
