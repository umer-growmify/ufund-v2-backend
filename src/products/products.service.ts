import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
async createProduct(
  createProductDto: CreateProductDto,
  id: string,
  activeRole: string,
  userType: string,
) {
  console.log(`User ID ${id} User active Role ${activeRole} user Type ${userType}`);

  if (userType === 'admin') {
    try {
      if (!createProductDto.campaignerId) {
        throw new BadRequestException('Campaigner ID is required');
      }

      const campaignerExists = await this.prisma.user.findUnique({
        where: { id: createProductDto.campaignerId },
        select: { roles: true },
      });

      if (!campaignerExists) throw new BadRequestException('Invalid campaigner ID');
      if (!campaignerExists.roles.includes('campaigner')) throw new BadRequestException('User is not a campaigner');

      const createProduct = await this.prisma.products.create({
        data: {
          ...createProductDto,
          creatorId: id,
        },
      });

      return { success: true, message: 'Product Created Successfully', data: createProduct };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message || 'Product Not created');
    }
  } else if (activeRole === 'campaigner') {
    console.log("Creating product by campaigner...");
    try {
      const createProduct = await this.prisma.products.create({
        data: {
          ...createProductDto,
          campaignerId: id,
          creatorId: id,
        },
      });
      console.log(createProduct);
      return { success: true, message: 'Product Created Successfully', data: createProduct };
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

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
