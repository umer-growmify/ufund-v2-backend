import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Roles, RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminRoleType } from '@prisma/client';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  async createCategory(@Body() createCategoryDto: any) {
    return this.categoryService.createCategory(createCategoryDto);
  }
}
