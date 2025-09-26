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
      throw new BadRequestException(error.message || 'assets Not created');
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
      throw new BadRequestException(error.message || 'assets Not created');
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
}
