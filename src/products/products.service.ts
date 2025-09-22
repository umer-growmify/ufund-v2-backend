import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AwsService } from 'src/aws/aws.service';
import { CreateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    files: {
      auditorsReport: Express.Multer.File[];
      document?: Express.Multer.File[];
      tokenImage: Express.Multer.File[];
      assetImage: Express.Multer.File[];
      imageOne?: Express.Multer.File[];
      imageTwo?: Express.Multer.File[];
    },
    id: string,
    activeRole: string,
    userType: string,
  ) {
    console.log('Create Product DTO: ', createProductDto);

    // Upload files to S3 and get keys
    const auditorsReport = await this.awsService.uploadFile(
      files.auditorsReport[0],
      id,
      'products',
    );
    const document = files.document?.[0]
      ? await this.awsService.uploadFile(files.document[0], id, 'products')
      : undefined;
    const tokenImage = await this.awsService.uploadFile(
      files.tokenImage[0],
      id,
      'products',
    );
    const assetImage = await this.awsService.uploadFile(
      files.assetImage[0],
      id,
      'products',
    );
    const imageOne = files.imageOne?.[0]
      ? await this.awsService.uploadFile(files.imageOne[0], id, 'products')
      : undefined;
    const imageTwo = files.imageTwo?.[0]
      ? await this.awsService.uploadFile(files.imageTwo[0], id, 'products')
      : undefined;

    if (userType === 'admin') {
      try {
        if (!createProductDto.campaignerId) {
          throw new BadRequestException('Campaigner ID is required');
        }

        const campaignerExists = await this.prisma.user.findUnique({
          where: { id: createProductDto.campaignerId },
          select: { roles: true },
        });

        if (!campaignerExists)
          throw new BadRequestException('Invalid campaigner ID');
        if (!campaignerExists.roles.includes('campaigner'))
          throw new BadRequestException('User is not a campaigner');

        const createProduct = await this.prisma.products.create({
          data: {
            ...createProductDto,
            creatorId: id,
            offerStartDate: new Date(createProductDto.offerStartDate),
            offerEndDate: new Date(createProductDto.offerEndDate),
            investmentStartDate: new Date(createProductDto.investmentStartDate),
            maturityDate: new Date(createProductDto.maturityDate),
            auditorsReportKey: auditorsReport.key,
            documentKey: document?.key,
            tokenImageKey: tokenImage.key,
            assetImageKey: assetImage.key,
            imageOneKey: imageOne?.key,
            imageTwoKey: imageTwo?.key,
          },
        });

        return {
          success: true,
          message: 'Product Created Successfully',
          data: {
            ...createProduct,
            auditorsReportUrl: auditorsReport.url,
            documentUrl: document?.url,
            tokenImageUrl: tokenImage.url,
            assetImageUrl: assetImage.url,
            imageOneUrl: imageOne?.url,
            imageTwoUrl: imageTwo?.url,
          },
        };
      } catch (error) {
        console.error(error);
        throw new BadRequestException(error.message || 'Product Not created');
      }
    } else if (activeRole === 'campaigner') {
      try {
        const createProduct = await this.prisma.products.create({
          data: {
            ...createProductDto,
            campaignerId: id,
            creatorId: id,
            adminCommission: createProductDto.adminCommission
              ? Number(createProductDto.adminCommission)
              : null,
            unitPrice: createProductDto.unitPrice || null,
            productTotalValue: createProductDto.productTotalValue
              ? Number(createProductDto.productTotalValue)
              : null,
            offerStartDate: new Date(createProductDto.offerStartDate),
            offerEndDate: new Date(createProductDto.offerEndDate),
            investmentStartDate: new Date(createProductDto.investmentStartDate),
            maturityDate: new Date(createProductDto.maturityDate),
            auditorsReportKey: auditorsReport.key,
            documentKey: document?.key,
            tokenImageKey: tokenImage.key,
            assetImageKey: assetImage.key,
            imageOneKey: imageOne?.key,
            imageTwoKey: imageTwo?.key,
          },
        });

        return {
          success: true,
          message: 'Product Created Successfully',
          data: {
            ...createProduct,
            auditorsReportUrl: auditorsReport.url,
            documentUrl: document?.url,
            tokenImageUrl: tokenImage.url,
            assetImageUrl: assetImage.url,
            imageOneUrl: imageOne?.url,
            imageTwoUrl: imageTwo?.url,
          },
        };
      } catch (error) {
        console.error(error);
        throw new BadRequestException(error.message || 'Product Not created');
      }
    }

    throw new UnauthorizedException('Invalid Role');
  }

  async getAllProducts() {
    const products = await this.prisma.products.findMany({
      include: {
        campaigner: true,
        category: true,
      },
    });

    // Generate signed URLs for each product's file keys
    const productsWithSignedUrls = await Promise.all(
      products.map(async (product) => {
        return {
          ...product,
          auditorsReportUrl: product.auditorsReportKey
            ? await this.awsService.getSignedUrl(product.auditorsReportKey)
            : null,
          documentUrl: product.documentKey
            ? await this.awsService.getSignedUrl(product.documentKey)
            : null,
          tokenImageUrl: product.tokenImageKey
            ? await this.awsService.getSignedUrl(product.tokenImageKey)
            : null,
          assetImageUrl: product.assetImageKey
            ? await this.awsService.getSignedUrl(product.assetImageKey)
            : null,
          imageOneUrl: product.imageOneKey
            ? await this.awsService.getSignedUrl(product.imageOneKey)
            : null,
          imageTwoUrl: product.imageTwoKey
            ? await this.awsService.getSignedUrl(product.imageTwoKey)
            : null,
        };
      }),
    );

    const getSingleProductUrl = await this.getProductSignedUrls(products[0].id);
    console.log('Single Product URL: ', getSingleProductUrl);

    console.log('Products with URLs: ', productsWithSignedUrls);

    return {
      success: true,
      message: 'Products retrieved successfully',
      data: productsWithSignedUrls,
    };
  }

  async getProductSignedUrls(productId: string) {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return {
      success: true,
      message: 'Signed URLs generated successfully',
      data: {
        auditorsReportUrl: product.auditorsReportKey
          ? await this.awsService.getSignedUrl(product.auditorsReportKey)
          : null,
        documentUrl: product.documentKey
          ? await this.awsService.getSignedUrl(product.documentKey)
          : null,
        tokenImageUrl: product.tokenImageKey
          ? await this.awsService.getSignedUrl(product.tokenImageKey)
          : null,
        assetImageUrl: product.assetImageKey
          ? await this.awsService.getSignedUrl(product.assetImageKey)
          : null,
        imageOneUrl: product.imageOneKey
          ? await this.awsService.getSignedUrl(product.imageOneKey)
          : null,
        imageTwoUrl: product.imageTwoKey
          ? await this.awsService.getSignedUrl(product.imageTwoKey)
          : null,
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.products.findUnique({
      where: { id },
      include: {
        campaigner: true,
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Generate signed URLs for each product's file keys
    const productWithSignedUrls = {
      ...product,
      auditorsReportUrl: product.auditorsReportKey
        ? await this.awsService.getSignedUrl(product.auditorsReportKey)
        : null,
      documentUrl: product.documentKey
        ? await this.awsService.getSignedUrl(product.documentKey)
        : null,
      tokenImageUrl: product.tokenImageKey
        ? await this.awsService.getSignedUrl(product.tokenImageKey)
        : null,
      assetImageUrl: product.assetImageKey
        ? await this.awsService.getSignedUrl(product.assetImageKey)
        : null,
      imageOneUrl: product.imageOneKey
        ? await this.awsService.getSignedUrl(product.imageOneKey)
        : null,
      imageTwoUrl: product.imageTwoKey
        ? await this.awsService.getSignedUrl(product.imageTwoKey)
        : null,
    };

    return {
      success: true,
      message: 'Product retrieved successfully',
      data: productWithSignedUrls,
    };
  }

  remove(id: string) {
    return `This action removes a #${id} product`;
  }
}
