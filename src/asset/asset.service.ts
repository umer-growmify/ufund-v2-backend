import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateAssetDto,
  CreateAssetTypeDto,
  CreateTokenTypeDto,
} from './dto/asset.dto';

@Injectable()
export class AssetService {
  constructor(private readonly prisma: PrismaService) {}

  async createAssetType(createAssetTypeDto: CreateAssetTypeDto) {
    try {
      const createAssetType = await this.prisma.assetType.create({
        data: createAssetTypeDto,
      });

      return {
        success: true,
        message: 'Asset type created successfully',
        data: createAssetType,
      };
    } catch (error) {
      throw new BadRequestException('Asset Type Do not Created');
    }
  }

  async createTokenType(createTokenTypeDto: CreateTokenTypeDto) {
    try {
      const createAssetType = await this.prisma.tokenType.create({
        data: createTokenTypeDto,
      });

      return {
        success: true,
        message: 'Token type created successfully',
        data: createAssetType,
      };
    } catch (error) {
      throw new BadRequestException('Token Type Do not Created');
    }
  }

  async createAsset(createAssetDto: CreateAssetDto, id: string) {
    try {
      const createAsset = await this.prisma.asset.create({
        data: {
          ...createAssetDto,
          creatorId: id,
        },
      });

      return {
        success: true,
        message: 'Asset created successfully',
        data: createAsset,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Product Not created');
    }
  }
}
