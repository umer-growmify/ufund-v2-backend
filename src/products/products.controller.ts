import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AdminRoleType, RoleType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles, RolesGuard } from 'src/auth/guards/roles.guard';
import { RequestWithUser } from 'src/types/types';
import { CreateProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a product (Campaigner or SUPER_ADMIN)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only campaigner or SUPER_ADMIN can create product' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN, RoleType.campaigner)
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: RequestWithUser,
  ) {
    const activeRole = req.user.activeRole;
    const userType = req.user.type;
    const id = req.user.id;
    return this.productsService.create(
      createProductDto,
      id,
      activeRole,
      userType,
    );
  }

  @Get('allproducts')
  @ApiOperation({ summary: 'Get all products (Investor, Campaigner, SUPER_ADMIN)' })
  @ApiResponse({ status: 200, description: 'List of all products returned' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN, RoleType.campaigner, RoleType.investor)
  findAll() {
    return this.productsService.getAllProducts();
  }

  // Optionally you can uncomment and document other endpoints like Get/:id, Patch, Delete when implemented.
}
