import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  EditAssetDto,
  EditAssetTypeDto,
  EditTokenTypeDto,
  UpdateAssetsStatusDto,
} from './dto/asset.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/types/types';
import { Roles } from 'src/auth/guards/roles.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileValidationInterceptor } from 'src/utils/file-validation.interceptor';
import { assetsFileConfig, editAssetFileConfig } from 'src/config/file-config';

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

  // get all asset types
  @Get('get-asset-types')
  @ApiOperation({ summary: 'Get all asset Types' })
  @ApiResponse({ status: 200, description: 'Asset types fetched successfully' })
  getAllAssetTypes() {
    return this.assetService.getAllAssetsType();
  }

  // get all token types
  @Get('get-token-types')
  @ApiOperation({ summary: 'Get all token Types' })
  @ApiResponse({ status: 200, description: 'Token types fetched successfully' })
  getAllTokenTypes() {
    return this.assetService.getAllTokenType();
  }

  // edit token type
  @Put('edit-token-type/:id')
  @ApiOperation({ summary: 'Edit a token Type (SUPER_ADMIN)' })
  @ApiResponse({ status: 200, description: 'Token type edited successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only  SUPER_ADMIN can edit token Type',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  editTokenType(
    @Param('id') id: string,
    @Body() createTokenTypeDto: EditTokenTypeDto,
  ) {
    return this.assetService.editTokenType(id, createTokenTypeDto.name);
  }

  // edit asset type
  @Put('edit-asset-type/:id')
  @ApiOperation({ summary: 'Edit a asset Type (SUPER_ADMIN)' })
  @ApiResponse({ status: 200, description: 'Asset type edited successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only  SUPER_ADMIN can edit asset Type',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  editAssetType(
    @Param('id') id: string,
    @Body() createAssetTypeDto: EditAssetTypeDto,
  ) {
    return this.assetService.editAssetType(id, createAssetTypeDto.name);
  }

  // delete token type
  @Delete('delete-token-type/:id')
  @ApiOperation({ summary: 'Delete a token Type (SUPER_ADMIN)' })
  @ApiResponse({ status: 200, description: 'Token type deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only  SUPER_ADMIN can delete token Type',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  deleteTokenType(@Param('id') id: string) {
    return this.assetService.deleteTokenType(id);
  }
  // delete asset type
  @Delete('delete-asset-type/:id')
  @ApiOperation({ summary: 'Delete a asset Type (SUPER_ADMIN)' })
  @ApiResponse({ status: 200, description: 'Asset type deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only  SUPER_ADMIN can delete asset Type',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  deleteAssetType(@Param('id') id: string) {
    return this.assetService.deleteAssetType(id);
  }

  @Put('update-asset-status/:id')
  @ApiOperation({ summary: 'Update asset status (SUPER_ADMIN)' })
  @ApiResponse({
    status: 200,
    description: 'Asset status updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only  SUPER_ADMIN can update asset status',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  updateAssetsStatus(
    @Param('id') id: string,
    @Body() updateAssetsStatusDto: UpdateAssetsStatusDto,
  ) {
    return this.assetService.updateAssetsStatus(id, updateAssetsStatusDto);
  }

  // get all assets
  @Get('get-all-assets')
  @ApiOperation({ summary: 'Get all assets' })
  @ApiResponse({ status: 200, description: 'Assets fetched successfully' })
  getAllAssets() {
    return this.assetService.getAllAssets();
  }

  @Put('edit/:id')
  @ApiOperation({ summary: 'Edit an asset (Admin only)' })
  @ApiResponse({ status: 200, description: 'Asset updated successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only admin can edit asset',
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
    new FileValidationInterceptor(editAssetFileConfig), // You'll need to create this config
  )
  async editAsset(
    @Body() editAssetDto: EditAssetDto,
    @Param('id') assetId: string,
    @UploadedFiles()
    files: {
      auditorsReportKey: Express.Multer.File[];
      documentKey?: Express.Multer.File[];
      productImageKey: Express.Multer.File[];
      assetImageKey: Express.Multer.File[];
      imageOneKey?: Express.Multer.File[];
      imageTwoKey?: Express.Multer.File[];
    },
    @Req() req: RequestWithUser,
  ) {
    const userType = req.user.type;
    const userId = req.user.id;

    return this.assetService.editAsset(assetId, editAssetDto, files, userId);
  }

  @Delete('delete-assets/:id')
  @ApiOperation({ summary: 'Delete an asset (Admin only)' })
  @ApiResponse({ status: 200, description: 'Asset deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only admin can delete asset',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  async deleteAsset(@Param('id') assetId: string, @Req() req: RequestWithUser) {
    return this.assetService.deleteAsset(assetId);
  }

  // get assettype by id
  @Get('get-asset-type-by-id/:id')
  @ApiOperation({ summary: 'Get asset type by id' })
  @ApiResponse({ status: 200, description: 'Asset type fetched successfully' })
  async getAssetTypeById(@Param('id') id: string) {
    return this.assetService.assetTypeById(id);
  }

  // get token type by id
  @Get('get-token-type-by-id/:id')
  @ApiOperation({ summary: 'Get token type by id' })
  @ApiResponse({ status: 200, description: 'Token type fetched successfully' })
  async getTokenTypeById(@Param('id') id: string) {
    return this.assetService.tokenTypeById(id);
  }

  // get asset by id
  @Get('get-asset-by-id/:id')
  @ApiOperation({ summary: 'Get asset by id' })
  @ApiResponse({ status: 200, description: 'Asset fetched successfully' })
  async getAssetById(@Param('id') id: string) {
    return this.assetService.getAssetById(id);
  }
}
