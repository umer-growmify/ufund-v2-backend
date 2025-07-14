import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminRoleType, RoleType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles, RolesGuard } from 'src/auth/guards/roles.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    console.log(`Creating category with name: ${createCategoryDto.name}`);
    
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN, RoleType.campaigner)
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN, RoleType.campaigner)
  async getCategoryById(@Param('id') id: string) {
    console.log(`Fetching category with ID: ${id}`);
    return this.categoryService.getCategoryById(id);
  } 
}