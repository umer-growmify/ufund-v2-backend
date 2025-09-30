import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserStatusDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllCampaigners() {
    const campaigners = await this.prisma.user.findMany({
      where: { roles: { has: 'campaigner' } }, // 👈 keep enum case consistent
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    const formatted = campaigners.map((c) => ({
      id: c.id,
      fullName: `${c.firstName} ${c.lastName}`,
    }));

    return {
      success: true,
      message: 'List of all campaigners',
      data: formatted,
    };
  }

  async updateUserStatus(userId: string, status: UpdateUserStatusDto) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { status: status.status },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        status: true,
        email: true,
        countryCode: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return {
      success: true,
      message: 'User status updated successfully',
      data: updatedUser,
    };
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        status: true,
        email: true,
        countryCode: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      message: 'List of all users',
      data: users,
    };
  }

  async deteleUser(userId: string) {
    const deletedUser = await this.prisma.user.delete({
      where: { id: userId },
    });

    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return {
      success: true,
      message: 'User deleted successfully',
      data: deletedUser,
    };
  }
}
