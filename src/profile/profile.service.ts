import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(dto: CreateProfileDto, userId: string) {

    //  Check if profile already exists
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new BadRequestException('Profile already exists for this user');
    }

    // Create profile
    const newUser = await this.prisma.profile.create({
      data: {
        userId,
        userAccountType: dto.userAccountType,
        incomeFrequency: dto.incomeFrequency,
        totalAnnualRevenue: dto.totalAnnualRevenue,
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2,
        zipCode: dto.zipCode,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        companyName: dto.companyName,
        companyEmail: dto.companyEmail,
        companyTelephone: dto.companyTelephone,
        companyAddress: dto.companyAddress,
        bankName: dto.bankName,
        accountNumber: dto.accountNumber,
        accountName: dto.accountName,
        routingNumber: dto.routingNumber,
        ibanNumber: dto.ibanNumber,
        swiftNumber: dto.swiftNumber,
        bankAccountType: dto.bankAccountType,
        bankAddress: dto.bankAddress,
      },
    });

    return {
      success: true,
      message: 'Profile created successfully',
      data: newUser,
    };
  }

  async getProfile(userId: string) {

    const user = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            countryCode: true,
            roles: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Profile not found');
    }
    return {
      success: true,
      message: 'Profile retrieved successfully',
      data: user,
    };
  }
}
