import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssetTypeDto } from './dto/assetType.dto';

@Injectable()
export class AssetTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async createAssetType(createAssetTypeDto: CreateAssetTypeDto) {
    try {
      const createAssetType = await this.prisma.assetType.create({
        data: {
          name: createAssetTypeDto.name,
        },
      });

      return {
        success: true,
        message: 'Asset Type created succefully',
        data: createAssetType,
      };
    } catch (error) {
      throw new NotFoundException('Asset Type creation failed');
    }
  }

  async getAllAssetType() {
    try {
      const getAllAssetType = await this.prisma.assetType.findMany();
      return {
        success: true,
        message: 'Assets Types retrieved Succefully',
        data: getAllAssetType,
      };
    } catch (error) {
      throw new NotFoundException('No Assets Types Found');
    }
  }

  

}
