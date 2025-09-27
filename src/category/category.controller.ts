import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminRoleType, RoleType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/guards/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationInterceptor } from 'src/utils/file-validation.interceptor';
import { categoryFileConfig } from 'src/config/file-config';

@ApiTags('Category') // Group all under Category in Swagger
@ApiBearerAuth() // Use Bearer token in Swagger
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new category (SUPER_ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SUPER_ADMIN can create category',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  @UseInterceptors(
    FileInterceptor('image'),
    new FileValidationInterceptor(categoryFileConfig),
  )
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log(`Creating category with name: ${createCategoryDto.name}`);
    return this.categoryService.createCategory(createCategoryDto, file);
  }

  @Get('get-all-product-category')
  @ApiOperation({ summary: 'Get all categories (SUPER_ADMIN and Campaigner)' })
  @ApiResponse({ status: 200, description: 'List of all categories returned' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN, RoleType.campaigner, RoleType.investor)
  async getAllProductCategories() {
    return this.categoryService.getAllProductCategories();
  }

  @Get('get-all-token-category')
  @ApiOperation({ summary: 'Get all categories (SUPER_ADMIN and Campaigner)' })
  @ApiResponse({ status: 200, description: 'List of all categories returned' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN, RoleType.campaigner, RoleType.investor)
  async getAllTokenCategories() {
    return this.categoryService.getAllTokenCategories();
  }

  // block category by id using param id
  @Post('block-category/:id')
  @ApiOperation({ summary: 'Block category by id (SUPER_ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Category blocked successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SUPER_ADMIN can block category',
  })
  @ApiParam({ name: 'id', required: true, description: 'Category ID' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  async blockCategory(@Param('id') id: string) {
    return this.categoryService.blockCategory(id);
  }

  // unblock category by id using param id
  @Post('unblock-category/:id')
  @ApiOperation({ summary: 'Unblock category by id (SUPER_ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Category unblocked successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SUPER_ADMIN can unblock category',
  })
  @ApiParam({ name: 'id', required: true, description: 'Category ID' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  async unblockCategory(@Param('id') id: string) {
    return this.categoryService.unblockCategory(id);
  }

  @Post('update-category/:id')
  @ApiOperation({ summary: 'update a new category (SUPER_ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Category update successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SUPER_ADMIN can update category',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  @UseInterceptors(
    FileInterceptor('image'),
    new FileValidationInterceptor(categoryFileConfig),
  )
  async editCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log(`Updating category with name: ${updateCategoryDto.name}`);
    return this.categoryService.editCategory(id, updateCategoryDto, file);
  }

  // delete category by id using param id
  @Delete('delete-category/:id')
  @ApiOperation({ summary: 'Delete category by id (SUPER_ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SUPER_ADMIN can delete category',
  })
  @ApiParam({ name: 'id', required: true, description: 'Category ID' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
