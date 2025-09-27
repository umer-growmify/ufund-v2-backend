import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { AdminRoleType, RoleType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RequestWithUser } from 'src/types/types';
import {
  CreateProductDto,
  EditProductDto,
  UpdateProductStatusDto,
} from './dto/product.dto';
import { ProductsService } from './products.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  editProductFileConfig,
  productFileConfig,
} from 'src/config/file-config';
import { FileValidationInterceptor } from 'src/utils/file-validation.interceptor';
import { Roles } from 'src/auth/guards/roles.decorator';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a product (Campaigner or SUPER_ADMIN)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Only campaigner or SUPER_ADMIN can create product',
  })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN, RoleType.campaigner)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'auditorsReport', maxCount: 1 },
      { name: 'document', maxCount: 1 },
      { name: 'tokenImage', maxCount: 1 },
      { name: 'assetImage', maxCount: 1 },
      { name: 'imageOne', maxCount: 1 },
      { name: 'imageTwo', maxCount: 1 },
    ]),
    new FileValidationInterceptor(productFileConfig),
  )
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files: {
      auditorsReport: Express.Multer.File[];
      document?: Express.Multer.File[];
      tokenImage: Express.Multer.File[];
      assetImage: Express.Multer.File[];
      imageOne?: Express.Multer.File[];
      imageTwo?: Express.Multer.File[];
    },
    @Req() req: RequestWithUser,
  ) {
    console.log('Request User: ', req.user);
    console.log('Create Product DTO: ', createProductDto);
    console.log('Files: ', files);

    const activeRole = req.user.activeRole;
    const userType = req.user.type;
    const id = req.user.id;
    return this.productsService.createProduct(
      createProductDto,
      files,
      id,
      activeRole,
      userType,
    );
  }

  @Get('allproducts')
  @ApiOperation({
    summary: 'Get all products (Investor, Campaigner, SUPER_ADMIN)',
  })
  @ApiResponse({ status: 200, description: 'List of all products returned' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN, RoleType.campaigner, RoleType.investor)
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  // products.controller.ts

  // change status of product by id
  @Put('change-status/:id')
  @ApiOperation({ summary: 'Change status of a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN, RoleType.campaigner)
  changeProductStatus(
    @Param('id') id: string,
    @Body() updateProductStatus: UpdateProductStatusDto,
  ) {
    return this.productsService.updateProductStatus(id, updateProductStatus);
  }

  // delete product by id
  @Delete('/delete-product/:id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN, RoleType.campaigner)
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  @Put('edit-product/:id')
  @ApiOperation({ summary: 'Edit a product (Campaigner or SUPER_ADMIN)' })
  @ApiResponse({ status: 201, description: 'edit created successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only  SUPER_ADMIN can edit product',
  })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'auditorsReport', maxCount: 1 },
      { name: 'document', maxCount: 1 },
      { name: 'tokenImage', maxCount: 1 },
      { name: 'assetImage', maxCount: 1 },
      { name: 'imageOne', maxCount: 1 },
      { name: 'imageTwo', maxCount: 1 },
    ]),
    new FileValidationInterceptor(editProductFileConfig),
  )
  async editProduct(
    @Body() editProductDto: EditProductDto,
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      auditorsReport: Express.Multer.File[];
      document?: Express.Multer.File[];
      tokenImage: Express.Multer.File[];
      assetImage: Express.Multer.File[];
      imageOne?: Express.Multer.File[];
      imageTwo?: Express.Multer.File[];
    },
    @Req() req: RequestWithUser,
  ) {
    console.log('Request User: ', req.user);
    console.log('Create Product DTO: ', editProductDto);
    console.log('Files: ', files);

    const activeRole = req.user.activeRole;
    const userType = req.user.type;
    return this.productsService.editProduct(
      id,
      editProductDto,
      files,
      activeRole,
    );
  }

  @Get('get-product-by-id/:id')
  @ApiOperation({ summary: 'Get a single product by ID' })
  @ApiResponse({ status: 200, description: 'Product returned successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN, RoleType.campaigner, RoleType.investor)
  getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }
}
