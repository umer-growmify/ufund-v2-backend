// src/admin/admin.controller.ts
import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AdminRoleType } from '@prisma/client';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles, RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminService } from './admin.service';
import { AdminLoginDto, CreateAdminDto } from './dto/admin.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Admin') // Swagger tag group
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  @ApiBearerAuth() // JWT Bearer Token required
  @ApiOperation({ summary: 'Create a new admin (SUPER_ADMIN only)' })
  @ApiResponse({
    status: 201,
    description: 'Admin account created successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SUPER_ADMIN can create admins',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Admin login endpoint' })
  @ApiResponse({ status: 201, description: 'Login successful with JWT token' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
  async login(
    @Body() adminLoginDto: AdminLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.login(adminLoginDto, res);
  }
}
