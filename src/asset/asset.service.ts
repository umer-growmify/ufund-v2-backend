import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateAssetDto,
  CreateAssetTypeDto,
  CreateTokenTypeDto,
  EditAssetDto,
  UpdateAssetsStatusDto,
} from './dto/asset.dto';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class AssetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
  ) {}

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

  async createCampaignerAsset(
    createAssetDto: CreateAssetDto,
    id: string,
    files: {
      auditorsReportKey: Express.Multer.File[];
      documentKey?: Express.Multer.File[];
      productImageKey: Express.Multer.File[];
      assetImageKey: Express.Multer.File[];
      imageOneKey?: Express.Multer.File[];
      imageTwoKey?: Express.Multer.File[];
    },
  ) {
    try {
      console.log('createAssetDto', createAssetDto);

      // Handle date fields conversion
      const offerStartDate = new Date(createAssetDto.offerStartDate);
      const offerEndDate = new Date(createAssetDto.offerEndDate);
      const rewardDate = createAssetDto.rewardDate
        ? new Date(createAssetDto.rewardDate)
        : undefined;

      // Validate dates
      if (isNaN(offerStartDate.getTime())) {
        throw new BadRequestException('Invalid offerStartDate format');
      }
      if (isNaN(offerEndDate.getTime())) {
        throw new BadRequestException('Invalid offerEndDate format');
      }
      if (rewardDate && isNaN(rewardDate.getTime())) {
        throw new BadRequestException('Invalid rewardDate format');
      }

      // Validate that offerEndDate is after offerStartDate
      if (offerEndDate <= offerStartDate) {
        throw new BadRequestException(
          'offerEndDate must be after offerStartDate',
        );
      }

      const auditorsReportKey = await this.awsService.uploadFile(
        files.auditorsReportKey[0],
        id,
        'assets',
      );
      const documentKey = files.documentKey?.[0]
        ? await this.awsService.uploadFile(files.documentKey[0], id, 'assets')
        : undefined;
      const productImageKey = await this.awsService.uploadFile(
        files.productImageKey[0],
        id,
        'assets',
      );
      const assetImageKey = await this.awsService.uploadFile(
        files.assetImageKey[0],
        id,
        'assets',
      );
      const imageOneKey = files.imageOneKey?.[0]
        ? await this.awsService.uploadFile(files.imageOneKey[0], id, 'assets')
        : undefined;
      const imageTwoKey = files.imageTwoKey?.[0]
        ? await this.awsService.uploadFile(files.imageTwoKey[0], id, 'assets')
        : undefined;

      const createAsset = await this.prisma.asset.create({
        data: {
          ...createAssetDto,
          offerStartDate,
          offerEndDate,
          rewardDate,
          auditorsReportKey: auditorsReportKey?.key,
          documentKey: documentKey?.key,
          productImageKey: productImageKey?.key,
          assetImageKey: assetImageKey?.key,
          imageOneKey: imageOneKey?.key,
          imageTwoKey: imageTwoKey?.key,
        },
      });

      return {
        success: true,
        message: 'Asset created successfully',
        data: createAsset,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Asset not created');
    }
  }

  async createAdminAsset(
    createAssetDto: CreateAssetDto,
    id: string,
    files: {
      auditorsReportKey: Express.Multer.File[];
      documentKey?: Express.Multer.File[];
      productImageKey: Express.Multer.File[];
      assetImageKey: Express.Multer.File[];
      imageOneKey?: Express.Multer.File[];
      imageTwoKey?: Express.Multer.File[];
    },
  ) {
    try {
      console.log('createAssetDto', createAssetDto);

      // Handle date fields conversion
      const offerStartDate = new Date(createAssetDto.offerStartDate);
      const offerEndDate = new Date(createAssetDto.offerEndDate);
      const rewardDate = createAssetDto.rewardDate
        ? new Date(createAssetDto.rewardDate)
        : undefined;

      // Validate dates
      if (isNaN(offerStartDate.getTime())) {
        throw new BadRequestException('Invalid offerStartDate format');
      }
      if (isNaN(offerEndDate.getTime())) {
        throw new BadRequestException('Invalid offerEndDate format');
      }
      if (rewardDate && isNaN(rewardDate.getTime())) {
        throw new BadRequestException('Invalid rewardDate format');
      }

      // Validate that offerEndDate is after offerStartDate
      if (offerEndDate <= offerStartDate) {
        throw new BadRequestException(
          'offerEndDate must be after offerStartDate',
        );
      }

      // Validate campaignerId for admin
      if (!createAssetDto.userId) {
        throw new BadRequestException(
          'User ID (campaigner) is required for admin asset creation',
        );
      }

      const campaignerExists = await this.prisma.user.findUnique({
        where: { id: createAssetDto.userId },
        select: { roles: true },
      });

      if (!campaignerExists) {
        throw new BadRequestException('Invalid campaigner ID');
      }

      if (!campaignerExists.roles.includes('campaigner')) {
        throw new BadRequestException('User is not a campaigner');
      }

      const auditorsReportKey = await this.awsService.uploadFile(
        files.auditorsReportKey[0],
        id,
        'assets',
      );
      const documentKey = files.documentKey?.[0]
        ? await this.awsService.uploadFile(files.documentKey[0], id, 'assets')
        : undefined;
      const productImageKey = await this.awsService.uploadFile(
        files.productImageKey[0],
        id,
        'assets',
      );
      const assetImageKey = await this.awsService.uploadFile(
        files.assetImageKey[0],
        id,
        'assets',
      );
      const imageOneKey = files.imageOneKey?.[0]
        ? await this.awsService.uploadFile(files.imageOneKey[0], id, 'assets')
        : undefined;
      const imageTwoKey = files.imageTwoKey?.[0]
        ? await this.awsService.uploadFile(files.imageTwoKey[0], id, 'assets')
        : undefined;

      const createAsset = await this.prisma.asset.create({
        data: {
          ...createAssetDto,
          offerStartDate,
          offerEndDate,
          rewardDate,
          creatorId: id, // Admin's ID as creator
          auditorsReportKey: auditorsReportKey?.key,
          documentKey: documentKey?.key,
          productImageKey: productImageKey?.key,
          assetImageKey: assetImageKey?.key,
          imageOneKey: imageOneKey?.key,
          imageTwoKey: imageTwoKey?.key,
        },
      });

      return {
        success: true,
        message: 'Asset created successfully',
        data: createAsset,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Asset not created');
    }
  }

  async getAllAssetsType() {
    const assetsType = await this.prisma.assetType.findMany();
    return {
      success: true,
      message: 'Assets Type retrieved successfully',
      data: assetsType,
    };
  }

  async getAllTokenType() {
    const tokenType = await this.prisma.tokenType.findMany();
    return {
      success: true,
      message: 'Token Type retrieved successfully',
      data: tokenType,
    };
  }

  // edit token type

  async editTokenType(id: string, name: string) {
    try {
      const tokenType = await this.prisma.tokenType.update({
        where: { id },
        data: { name },
      });
      return {
        success: true,
        message: 'Token Type updated successfully',
        data: tokenType,
      };
    } catch (error) {
      throw new BadRequestException('Token Type not updated');
    }
  }

  async editAssetType(id: string, name: string) {
    try {
      const assetType = await this.prisma.assetType.update({
        where: { id },
        data: { name },
      });
      return {
        success: true,
        message: 'Asset Type updated successfully',
        data: assetType,
      };
    } catch (error) {
      throw new BadRequestException('Asset Type not updated');
    }
  }

  // delete assests type
  async deleteAssetType(id: string) {
    try {
      const assetType = await this.prisma.assetType.delete({
        where: { id },
      });
      return {
        success: true,
        message: 'Asset Type deleted successfully',
        data: assetType,
      };
    } catch (error) {
      throw new BadRequestException('Asset Type not deleted');
    }
  }
  // delete token type
  async deleteTokenType(id: string) {
    try {
      const tokenType = await this.prisma.tokenType.delete({
        where: { id },
      });
      return {
        success: true,
        message: 'Token Type deleted successfully',
        data: tokenType,
      };
    } catch (error) {
      throw new BadRequestException('Token Type not deleted');
    }
  }

  async getAssetsSignedUrls(productId: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { id: productId },
    });

    if (!asset) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return {
      success: true,
      message: 'Signed URLs generated successfully',
      data: {
        auditorsReportUrl: asset.auditorsReportKey
          ? await this.awsService.getSignedUrl(asset.auditorsReportKey)
          : null,
        documentUrl: asset.documentKey
          ? await this.awsService.getSignedUrl(asset.documentKey)
          : null,
        tokenImageUrl: asset.assetImageKey
          ? await this.awsService.getSignedUrl(asset.assetImageKey)
          : null,
        assetImageUrl: asset.assetImageKey
          ? await this.awsService.getSignedUrl(asset.assetImageKey)
          : null,
        imageOneUrl: asset.imageOneKey
          ? await this.awsService.getSignedUrl(asset.imageOneKey)
          : null,
        imageTwoUrl: asset.imageTwoKey
          ? await this.awsService.getSignedUrl(asset.imageTwoKey)
          : null,
      },
    };
  }

  async updateAssetsStatus(assetId: string, status: UpdateAssetsStatusDto) {
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      throw new NotFoundException(`Product with ID ${assetId} not found`);
    }

    const updatedAsset = await this.prisma.asset.update({
      where: { id: assetId },
      data: { status: status.status },
    });

    return {
      success: true,
      message: 'Asset status updated successfully',
      data: updatedAsset,
    };
  }

  async getAllAssets() {
    try {
      const assets = await this.prisma.asset.findMany({
        include: {
          category: true,
          assetType: true,
          tokenType: true,
          user: true,
        },
      });

      if (!assets || assets.length === 0) {
        throw new NotFoundException('No assets found');
      }

      // Generate signed URLs for each asset's file keys
      const assetsWithSignedUrls = await Promise.all(
        assets.map(async (asset) => {
          return {
            ...asset,
            auditorsReportUrl: asset.auditorsReportKey
              ? await this.awsService.getSignedUrl(asset.auditorsReportKey)
              : null,
            documentUrl: asset.documentKey
              ? await this.awsService.getSignedUrl(asset.documentKey)
              : null,
            productImageUrl: asset.productImageKey
              ? await this.awsService.getSignedUrl(asset.productImageKey)
              : null,
            assetImageUrl: asset.assetImageKey
              ? await this.awsService.getSignedUrl(asset.assetImageKey)
              : null,
            imageOneUrl: asset.imageOneKey
              ? await this.awsService.getSignedUrl(asset.imageOneKey)
              : null,
            imageTwoUrl: asset.imageTwoKey
              ? await this.awsService.getSignedUrl(asset.imageTwoKey)
              : null,
          };
        }),
      );

      return {
        success: true,
        message: 'Assets retrieved successfully',
        data: assetsWithSignedUrls,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching assets:', error);
      throw new BadRequestException('Failed to retrieve assets');
    }
  }

  async editAsset(
    assetId: string,
    editAssetDto: EditAssetDto,
    files: {
      auditorsReportKey: Express.Multer.File[];
      documentKey?: Express.Multer.File[];
      productImageKey: Express.Multer.File[];
      assetImageKey: Express.Multer.File[];
      imageOneKey?: Express.Multer.File[];
      imageTwoKey?: Express.Multer.File[];
    },
    userId: string,
  ) {
    try {
      // Find the existing asset
      const asset = await this.prisma.asset.findUnique({
        where: { id: assetId },
        include: {
          category: true,
          assetType: true,
          tokenType: true,
          user: true,
        },
      });

      if (!asset) {
        throw new NotFoundException(`Asset with ID ${assetId} not found`);
      }

      // Prepare update data
      const updateData: any = {
        ...editAssetDto,
        updatedAt: new Date(),
      };

      // Remove undefined values
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      // Handle date fields if they are provided
      if (editAssetDto.offerStartDate) {
        updateData.offerStartDate = new Date(editAssetDto.offerStartDate);
      }
      if (editAssetDto.offerEndDate) {
        updateData.offerEndDate = new Date(editAssetDto.offerEndDate);
      }
      if (editAssetDto.rewardDate) {
        updateData.rewardDate = new Date(editAssetDto.rewardDate);
      }

      // Handle file updates
      const fileUpdates: Promise<{ key: string; url: string }>[] = [];

      if (files.auditorsReportKey?.[0] && asset.auditorsReportKey) {
        fileUpdates.push(
          this.awsService.updateFile(
            files.auditorsReportKey[0],
            asset.auditorsReportKey,
          ),
        );
      } else if (files.auditorsReportKey?.[0] && !asset.auditorsReportKey) {
        // If no existing key, upload as new file
        const auditorsReport = await this.awsService.uploadFile(
          files.auditorsReportKey[0],
          userId,
          'assets',
        );
        updateData.auditorsReportKey = auditorsReport.key;
      }

      if (files.documentKey?.[0] && asset.documentKey) {
        fileUpdates.push(
          this.awsService.updateFile(files.documentKey[0], asset.documentKey),
        );
      } else if (files.documentKey?.[0] && !asset.documentKey) {
        const document = await this.awsService.uploadFile(
          files.documentKey[0],
          userId,
          'assets',
        );
        updateData.documentKey = document.key;
      }

      if (files.productImageKey?.[0] && asset.productImageKey) {
        fileUpdates.push(
          this.awsService.updateFile(
            files.productImageKey[0],
            asset.productImageKey,
          ),
        );
      } else if (files.productImageKey?.[0] && !asset.productImageKey) {
        const productImage = await this.awsService.uploadFile(
          files.productImageKey[0],
          userId,
          'assets',
        );
        updateData.productImageKey = productImage.key;
      }

      if (files.assetImageKey?.[0] && asset.assetImageKey) {
        fileUpdates.push(
          this.awsService.updateFile(
            files.assetImageKey[0],
            asset.assetImageKey,
          ),
        );
      } else if (files.assetImageKey?.[0] && !asset.assetImageKey) {
        const assetImage = await this.awsService.uploadFile(
          files.assetImageKey[0],
          userId,
          'assets',
        );
        updateData.assetImageKey = assetImage.key;
      }

      if (files.imageOneKey?.[0] && asset.imageOneKey) {
        fileUpdates.push(
          this.awsService.updateFile(files.imageOneKey[0], asset.imageOneKey),
        );
      } else if (files.imageOneKey?.[0] && !asset.imageOneKey) {
        const imageOne = await this.awsService.uploadFile(
          files.imageOneKey[0],
          userId,
          'assets',
        );
        updateData.imageOneKey = imageOne.key;
      }

      if (files.imageTwoKey?.[0] && asset.imageTwoKey) {
        fileUpdates.push(
          this.awsService.updateFile(files.imageTwoKey[0], asset.imageTwoKey),
        );
      } else if (files.imageTwoKey?.[0] && !asset.imageTwoKey) {
        const imageTwo = await this.awsService.uploadFile(
          files.imageTwoKey[0],
          userId,
          'assets',
        );
        updateData.imageTwoKey = imageTwo.key;
      }

      // Wait for all file updates to complete
      if (fileUpdates.length > 0) {
        await Promise.all(fileUpdates);
      }

      // Update the asset in database
      const updatedAsset = await this.prisma.asset.update({
        where: { id: assetId },
        data: updateData,
        include: {
          category: true,
          assetType: true,
          tokenType: true,
          user: true,
        },
      });

      // Generate signed URLs for the updated asset
      const assetWithSignedUrls = {
        ...updatedAsset,
        auditorsReportUrl: updatedAsset.auditorsReportKey
          ? await this.awsService.getSignedUrl(updatedAsset.auditorsReportKey)
          : null,
        documentUrl: updatedAsset.documentKey
          ? await this.awsService.getSignedUrl(updatedAsset.documentKey)
          : null,
        productImageUrl: updatedAsset.productImageKey
          ? await this.awsService.getSignedUrl(updatedAsset.productImageKey)
          : null,
        assetImageUrl: updatedAsset.assetImageKey
          ? await this.awsService.getSignedUrl(updatedAsset.assetImageKey)
          : null,
        imageOneUrl: updatedAsset.imageOneKey
          ? await this.awsService.getSignedUrl(updatedAsset.imageOneKey)
          : null,
        imageTwoUrl: updatedAsset.imageTwoKey
          ? await this.awsService.getSignedUrl(updatedAsset.imageTwoKey)
          : null,
      };

      return {
        success: true,
        message: 'Asset updated successfully',
        data: assetWithSignedUrls,
      };
    } catch (error) {
      console.error('Error updating asset:', error);
      throw new BadRequestException(error.message || 'Failed to update asset');
    }
  }

  async deleteAsset(assetId: string) {
    try {
      // Find the existing asset
      const asset = await this.prisma.asset.findUnique({
        where: { id: assetId },
      });

      if (!asset) {
        throw new NotFoundException(`Asset with ID ${assetId} not found`);
      }

      // Delete associated files from S3 (optional - if you want to clean up S3)
      const fileKeys = [
        asset.auditorsReportKey,
        asset.documentKey,
        asset.productImageKey,
        asset.assetImageKey,
        asset.imageOneKey,
        asset.imageTwoKey,
      ].filter((key) => key !== null);

      // Delete files from S3 (optional - comment out if you don't want to delete from S3)
      if (fileKeys.length > 0) {
        try {
          await this.awsService.deleteFiles(fileKeys);
        } catch (error) {
          console.error('Error deleting files from S3:', error);
          // Continue with database deletion even if S3 deletion fails
        }
      }

      // Delete the asset from database
      await this.prisma.asset.delete({
        where: { id: assetId },
      });

      return {
        success: true,
        message: 'Asset deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw new BadRequestException(error.message || 'Failed to delete asset');
    }
  }
}
