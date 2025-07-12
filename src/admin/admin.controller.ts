// src/admin/admin.controller.ts
import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AdminRoleType } from '@prisma/client';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles, RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminService } from './admin.service';
import { AdminLoginDto, CreateAdminDto } from './dto/admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Post('login')
  async login(
    @Body() adminLoginDto: AdminLoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.adminService.login(adminLoginDto, res);
  }
}