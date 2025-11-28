import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AwsService } from 'src/aws/aws.service';
import {
  CreateProductDto,
  EditProductDto,
  UpdateProductStatusDto,
} from './dto/product.dto';
import { PaginationDto, ProductFiltersDto } from './dto/product-filters.dto';

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

    // const getSingleProductUrl = await this.getProductSignedUrls(products[0].id);
    // console.log('Single Product URL: ', getSingleProductUrl);

    console.log('Products with URLs: ', productsWithSignedUrls);

    return {
      success: true,
      message: 'Products retrieved successfully',
      data: productsWithSignedUrls,
    };
  }

  async updateProductStatus(productId: string, status: UpdateProductStatusDto) {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const updatedProduct = await this.prisma.products.update({
      where: { id: productId },
      data: { status: status.status },
    });

    return {
      success: true,
      message: 'Product status updated successfully',
      data: updatedProduct,
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

  async deleteProduct(productId: string) {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Delete product from database
    await this.prisma.products.delete({
      where: { id: productId },
    });

    return {
      success: true,
      message: 'Product and associated files deleted successfully',
    };
  }

  // edit Prduct by id

  async editProduct(
    productId: string,
    editProductDto: EditProductDto,
    files: {
      auditorsReport: Express.Multer.File[];
      document?: Express.Multer.File[];
      tokenImage: Express.Multer.File[];
      assetImage: Express.Multer.File[];
      imageOne?: Express.Multer.File[];
      imageTwo?: Express.Multer.File[];
    },
    userId: string,
  ) {
    try {
      // Only admin can edit products

      // Find the existing product
      const product = await this.prisma.products.findUnique({
        where: { id: productId },
        include: {
          campaigner: true,
          category: true,
        },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      // Prepare update data
      const updateData: any = {
        ...editProductDto,
        updatedAt: new Date(),
      };

      // Remove undefined values
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      // Handle date fields if they are provided
      if (editProductDto.offerStartDate) {
        updateData.offerStartDate = new Date(editProductDto.offerStartDate);
      }
      if (editProductDto.offerEndDate) {
        updateData.offerEndDate = new Date(editProductDto.offerEndDate);
      }
      if (editProductDto.investmentStartDate) {
        updateData.investmentStartDate = new Date(
          editProductDto.investmentStartDate,
        );
      }
      if (editProductDto.maturityDate) {
        updateData.maturityDate = new Date(editProductDto.maturityDate);
      }

      // Handle file updates using your updateFile method
      const fileUpdates: Promise<{ key: string; url: string }>[] = [];

      if (files.auditorsReport?.[0] && product.auditorsReportKey) {
        fileUpdates.push(
          this.awsService.updateFile(
            files.auditorsReport[0],
            product.auditorsReportKey,
          ),
        );
      } else if (files.auditorsReport?.[0] && !product.auditorsReportKey) {
        // If no existing key, upload as new file
        const auditorsReport = await this.awsService.uploadFile(
          files.auditorsReport[0],
          userId,
          'products',
        );
        updateData.auditorsReportKey = auditorsReport.key;
      }

      if (files.document?.[0] && product.documentKey) {
        fileUpdates.push(
          this.awsService.updateFile(files.document[0], product.documentKey),
        );
      } else if (files.document?.[0] && !product.documentKey) {
        const document = await this.awsService.uploadFile(
          files.document[0],
          userId,
          'products',
        );
        updateData.documentKey = document.key;
      }

      if (files.tokenImage?.[0] && product.tokenImageKey) {
        fileUpdates.push(
          this.awsService.updateFile(
            files.tokenImage[0],
            product.tokenImageKey,
          ),
        );
      } else if (files.tokenImage?.[0] && !product.tokenImageKey) {
        const tokenImage = await this.awsService.uploadFile(
          files.tokenImage[0],
          userId,
          'products',
        );
        updateData.tokenImageKey = tokenImage.key;
      }

      if (files.assetImage?.[0] && product.assetImageKey) {
        fileUpdates.push(
          this.awsService.updateFile(
            files.assetImage[0],
            product.assetImageKey,
          ),
        );
      } else if (files.assetImage?.[0] && !product.assetImageKey) {
        const assetImage = await this.awsService.uploadFile(
          files.assetImage[0],
          userId,
          'products',
        );
        updateData.assetImageKey = assetImage.key;
      }

      if (files.imageOne?.[0] && product.imageOneKey) {
        fileUpdates.push(
          this.awsService.updateFile(files.imageOne[0], product.imageOneKey),
        );
      } else if (files.imageOne?.[0] && !product.imageOneKey) {
        const imageOne = await this.awsService.uploadFile(
          files.imageOne[0],
          userId,
          'products',
        );
        updateData.imageOneKey = imageOne.key;
      }

      if (files.imageTwo?.[0] && product.imageTwoKey) {
        fileUpdates.push(
          this.awsService.updateFile(files.imageTwo[0], product.imageTwoKey),
        );
      } else if (files.imageTwo?.[0] && !product.imageTwoKey) {
        const imageTwo = await this.awsService.uploadFile(
          files.imageTwo[0],
          userId,
          'products',
        );
        updateData.imageTwoKey = imageTwo.key;
      }

      // Wait for all file updates to complete
      if (fileUpdates.length > 0) {
        await Promise.all(fileUpdates);
      }

      // Update the product in database
      const updatedProduct = await this.prisma.products.update({
        where: { id: productId },
        data: updateData,
        include: {
          campaigner: true,
          category: true,
        },
      });

      // Generate signed URLs for the updated product
      const productWithSignedUrls = {
        ...updatedProduct,
        auditorsReportUrl: updatedProduct.auditorsReportKey
          ? await this.awsService.getSignedUrl(updatedProduct.auditorsReportKey)
          : null,
        documentUrl: updatedProduct.documentKey
          ? await this.awsService.getSignedUrl(updatedProduct.documentKey)
          : null,
        tokenImageUrl: updatedProduct.tokenImageKey
          ? await this.awsService.getSignedUrl(updatedProduct.tokenImageKey)
          : null,
        assetImageUrl: updatedProduct.assetImageKey
          ? await this.awsService.getSignedUrl(updatedProduct.assetImageKey)
          : null,
        imageOneUrl: updatedProduct.imageOneKey
          ? await this.awsService.getSignedUrl(updatedProduct.imageOneKey)
          : null,
        imageTwoUrl: updatedProduct.imageTwoKey
          ? await this.awsService.getSignedUrl(updatedProduct.imageTwoKey)
          : null,
      };

      return {
        success: true,
        message: 'Product updated successfully',
        data: productWithSignedUrls,
      };
    } catch (error) {
      console.error('Error updating product:', error);
      throw new BadRequestException(
        error.message || 'Failed to update product',
      );
    }
  }

  async getProductById(id: string) {
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

  async getFilteredProducts(
    filters: ProductFiltersDto,
    pagination?: PaginationDto,
  ) {
    const {
      categoryIds,
      minPrice,
      maxPrice,
      offerStartDateFrom,
      offerStartDateTo,
      offerEndDateFrom,
      offerEndDateTo,
      maturityDateFrom,
      maturityDateTo,
      campaignerIds,
      status,
      riskScale,
    } = filters;

    const { skip = 0, take = 10 } = pagination || {};

    // Build where clause dynamically
    const where: any = {};

    // Category filter
    if (categoryIds && categoryIds.length > 0) {
      where.categoryId = { in: categoryIds };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.OR = [
        {
          productTotalValue: {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          },
        },
        {
          unitPrice: {
            ...(minPrice !== undefined && { gte: minPrice.toString() }),
            ...(maxPrice !== undefined && { lte: maxPrice.toString() }),
          },
        },
      ];
    }

    // Offer date range filters
    if (offerStartDateFrom || offerStartDateTo) {
      where.offerStartDate = {
        ...(offerStartDateFrom && { gte: new Date(offerStartDateFrom) }),
        ...(offerStartDateTo && { lte: new Date(offerStartDateTo) }),
      };
    }

    if (offerEndDateFrom || offerEndDateTo) {
      where.offerEndDate = {
        ...(offerEndDateFrom && { gte: new Date(offerEndDateFrom) }),
        ...(offerEndDateTo && { lte: new Date(offerEndDateTo) }),
      };
    }

    // Maturity date range filter
    if (maturityDateFrom || maturityDateTo) {
      where.maturityDate = {
        ...(maturityDateFrom && { gte: new Date(maturityDateFrom) }),
        ...(maturityDateTo && { lte: new Date(maturityDateTo) }),
      };
    }

    // Campaigner filter
    if (campaignerIds && campaignerIds.length > 0) {
      where.campaignerId = { in: campaignerIds };
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    // Risk scale filter
    if (riskScale) {
      where.riskScale = riskScale;
    }

    try {
      // Execute query with pagination
      const [products, totalCount] = await Promise.all([
        this.prisma.products.findMany({
          where,
          skip,
          take,
          include: {
            category: true,
            campaigner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.products.count({ where }),
      ]);

      // Generate signed URLs for each product
      const productsWithSignedUrls = await Promise.all(
        products.map(async (product) => ({
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
        })),
      );

      return {
        success: true,
        message: 'Filtered products retrieved successfully',
        data: {
          products: productsWithSignedUrls,
          totalCount,
          hasNextPage: skip + take < totalCount,
          currentPage: Math.floor(skip / take) + 1,
          totalPages: Math.ceil(totalCount / take),
        },
      };
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      throw new BadRequestException(
        error.message || 'Failed to fetch filtered products',
      );
    }
  }
}
