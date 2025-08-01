import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
  ) {}

  async createProfile(dto: CreateProfileDto, userId: string, file?: Express.Multer.File) {
    // Check if profile already exists
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new BadRequestException('Profile already exists for this user');
    }

    // Handle image upload to S3
    let imageUrl: string | null = null;
    if (file) {
      imageUrl = await this.awsService.uploadFile(file, userId, 'profiles');
    }

    // Create profile with S3 URL if uploaded
    const newUser = await this.prisma.profile.create({
      data: {
        userId,
        userAccountType: dto.userAccountType,
        image: imageUrl,
        incomeFrequency: dto.incomeFrequency,
        totalAnnualRevenue: Number(dto.totalAnnualRevenue) || 0, // Ensure it's a number
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