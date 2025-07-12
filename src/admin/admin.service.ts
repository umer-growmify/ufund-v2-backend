import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminLoginDto, CreateAdminDto } from './dto/admin.dto';
import { validateAdmin } from 'src/utils/auth.helper';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async createAdmin(createAdminDto: CreateAdminDto) {
    // Check if email already exists
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: createAdminDto.email },
    });

    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    // Create admin with single role
    const createAdmin = await this.prisma.admin.create({
      data: {
        name: createAdminDto.name,
        email: createAdminDto.email,
        password: hashedPassword,
        role: createAdminDto.role, // Single role field
      },
    });

    if (!createAdmin) {
      throw new BadRequestException('Failed to create admin');
    }

    return {
      success: true,
      message: 'Admin created successfully',
      data: {
        id: createAdmin.id,
        name: createAdmin.name,
        email: createAdmin.email,
        role: createAdmin.role,
      },
    };
  }

  async login(adminLoginDto: AdminLoginDto, res: Response) {
    const admin = await validateAdmin(
      this.prisma,
      adminLoginDto.email,
      adminLoginDto.password,
    );

     // Verify admin has a role
  if (!admin.role) {
    throw new BadRequestException('Admin has no role assigned');
  }

    const payload = {
      id: admin.id,
      email: admin.email,
      activeRole: admin.role, // Automatically set active role
      type: 'admin',
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      success: true,
      message: 'Admin login successful',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        activeRole: admin.role, // Include active role in response
      },
    };
  }
}
