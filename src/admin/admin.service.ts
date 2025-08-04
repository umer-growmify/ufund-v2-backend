import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async createAdmin(createAdminDto: CreateAdminDto) {
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: createAdminDto.email },
    });

    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const createAdmin = await this.prisma.admin.create({
      data: {
        name: createAdminDto.name,
        email: createAdminDto.email,
        password: hashedPassword,
        role: createAdminDto.role,
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
}