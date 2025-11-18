import {
  ConflictException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
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

  async adminDashboard() {
    // Total users count
    const totalUsers = await this.prisma.user.count();

    // Total campaigns count
    // const totalCampaigns = await this.prisma.user.count();

    // Total investors count (users with 'investor' role)
    const totalInvestors = await this.prisma.user.count({
      where: {
        roles: {
          has: 'investor',
        },
      },
    });

    // Total campaigners count (users with 'campaigner' role)
    const totalCampaigners = await this.prisma.user.count({
      where: {
        roles: {
          has: 'campaigner',
        },
      },
    });

    // Recent users (last 5 users)
    const recentUsers = await this.prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roles: true,
        status: true,
        createdAt: true,
      },
    });

    const totalProducts = await this.prisma.products.count();

    const pendingTokens = await this.prisma.asset.count({
      where: {
        status: 'PENDING',
      },
    });

    return {
      success: true,
      message: 'Admin dashboard retrieved successfully',
      data: {
        users: {
          totalUsers,
          totalInvestors,
          totalCampaigners,
          recentUsers,
        },
        products: {
          totalProducts,
        },
        tokens: {
          pendingTokens,
        },
      },
    };
  }
}
