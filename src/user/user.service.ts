import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
