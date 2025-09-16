import {
  Body,
  Controller,
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
import { CreateCategoryDto } from './dto/category.dto';
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
  @Roles(AdminRoleType.SUPER_ADMIN, RoleType.campaigner)
  async getAllCategories() {
    return this.categoryService.getAllProductCategories();
  }

}
