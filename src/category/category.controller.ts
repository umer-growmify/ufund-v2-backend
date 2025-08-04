import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminRoleType, RoleType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {  RolesGuard } from 'src/auth/guards/roles.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/category.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/guards/roles.decorator';

@ApiTags('Category') // Group all under Category in Swagger
@ApiBearerAuth() // Use Bearer token in Swagger
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new category (SUPER_ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only SUPER_ADMIN can create category' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    console.log(`Creating category with name: ${createCategoryDto.name}`);
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all categories (SUPER_ADMIN and Campaigner)' })
  @ApiResponse({ status: 200, description: 'List of all categories returned' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN, RoleType.campaigner)
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID (SUPER_ADMIN and Campaigner)' })
  @ApiParam({ name: 'id', description: 'Category ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Category fetched successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN, RoleType.campaigner)
  async getCategoryById(@Param('id') id: string) {
    console.log(`Fetching category with ID: ${id}`);
    return this.categoryService.getCategoryById(id);
  }
}
