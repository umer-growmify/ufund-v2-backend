import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createProductDto: CreateProductDto,
    id: string, // User ID from token/cookie
    activeRole: string,
    userType: string,
  ) {
    // Validate user ID exists
    if (!id) {
      throw new NotFoundException('User ID not found');
    }

    let campaignerId: string;

    // Determine campaigner ID based on user type
    if (userType === 'admin') {
      // Admin: Get campaigner ID from DTO
      if (!createProductDto.campaignerId) {
        throw new BadRequestException(
          'campaignerId is required for admin users',
        );
      }
      campaignerId = createProductDto.campaignerId;
    } else if (userType === 'user' && activeRole === 'campaigner') {
      // Non-admin: Use ID from token/cookie
      campaignerId = id;
    } else {
      throw new BadRequestException('Invalid user type or role');
    }

    // Verify campaigner exists
    const campaigner = await this.prisma.user.findUnique({
      where: { id: campaignerId },
    });

    if (!campaigner) {
      throw new NotFoundException('Campaigner not found');
    }

    // Verify category exists
    const category = await this.prisma.category.findFirst({
      where: {
        id: createProductDto.categoryId,
        categoryType: 'PRODUCT',
      },
    });

    if (!category) {
      throw new BadRequestException('Invalid category or category type');
    }

    // Create product with proper dates
    const createProduct = await this.prisma.products.create({
      data: {
        ...createProductDto,
        campaignerId,
        offerStartDate: new Date(createProductDto.offerStartDate),
        offerEndDate: new Date(createProductDto.offerEndDate),
        investmentStartDate: new Date(createProductDto.investmentStartDate),
        maturityDate: new Date(createProductDto.maturityDate),
      },
    });

    return {
      success: true,
      message: 'Product created successfully',
      data: createProduct,
    };
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
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
