import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
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
    // Upload files to S3
    const auditorsReportUrl = await this.awsService.uploadFile(
      files.auditorsReport[0],
      id,
      'products',
    );
    const documentUrl = files.document?.[0]
      ? await this.awsService.uploadFile(files.document[0], id, 'products')
      : undefined;
    const tokenImageUrl = await this.awsService.uploadFile(
      files.tokenImage[0],
      id,
      'products',
    );
    const assetImageUrl = await this.awsService.uploadFile(
      files.assetImage[0],
      id,
      'products',
    );
    const imageUrlOne = files.imageOne?.[0]
      ? await this.awsService.uploadFile(files.imageOne[0], id, 'products')
      : undefined;
    const imageUrlTwo = files.imageTwo?.[0]
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
            auditorsReportUrl,
            documentUrl,
            tokenImageUrl,
            assetImageUrl,
            imageUrlOne,
            imageUrlTwo,
          },
        });

        return {
          success: true,
          message: 'Product Created Successfully',
          data: createProduct,
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
            auditorsReportUrl,
            documentUrl,
            tokenImageUrl,
            assetImageUrl,
            imageUrlOne,
            imageUrlTwo,
          },
        });
        return {
          success: true,
          message: 'Product Created Successfully',
          data: createProduct,
        };
      } catch (error) {
        console.error(error);
        throw new BadRequestException(error.message || 'Product Not created');
      }
    }

    throw new UnauthorizedException('Invalid Role');
  }

  async getAllProducts() {
    const getAllProducts = await this.prisma.products.findMany({
      include: {
        campaigner: true,
        category: true,
      },
    });

    return {
      success: true,
      message: 'Products retrieved successfully',
      data: getAllProducts,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}