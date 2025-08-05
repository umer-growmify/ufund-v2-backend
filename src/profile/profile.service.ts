import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
  ) {}

  async createProfile(
    dto: CreateProfileDto,
    userId: string,
    file?: Express.Multer.File,
  ) {
    // Check if profile already exists
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new BadRequestException('Profile already exists for this user');
    }

    // Handle image upload to S3
    let imageKey: string | null = null;
    let imageUrl: string | null = null;
    if (file) {
      const { key, url } = await this.awsService.uploadFile(
        file,
        userId,
        'profiles',
      );
      imageKey = key;
      imageUrl = url;
    }

    // Create profile with S3 key if uploaded
    const newUser = await this.prisma.profile.create({
      data: {
        userId,
        userAccountType: dto.userAccountType,
        imageKey, // Store the S3 key
        incomeFrequency: dto.incomeFrequency,
        totalAnnualRevenue: Number(dto.totalAnnualRevenue) || 0,
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
      data: {
        ...newUser,
        imageUrl, // Return the signed URL
      },
    };
  }

  async updateProfile(
    dto: UpdateProfileDto,
    userId: string,
    file?: Express.Multer.File,
  ) {
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    

    if (!existingProfile) {
      throw new NotFoundException('Profile not found');
    }

    let imageKey: string | null = existingProfile.imageKey;
    let imageUrl: string | null = existingProfile.imageKey
      ? await this.awsService.getSignedUrl(existingProfile.imageKey)
      : null;

    if (file) {
      const { key, url } = await this.awsService.uploadFile(
        file,
        userId,
        'profiles',
      );
      imageKey = key;
      imageUrl = url;
    }

    const updatedProfile = await this.prisma.profile.update({
      where: { userId },
      data: {
        userAccountType: dto.userAccountType,
        incomeFrequency: dto.incomeFrequency,
        totalAnnualRevenue: dto.totalAnnualRevenue
          ? Number(dto.totalAnnualRevenue)
          : undefined,
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
        imageKey,
      },
    });

    return {
      success: true,
      message: 'Profile updated successfully',
      data: {
        ...updatedProfile,
        imageUrl,
      },
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

    // Generate signed URL for image if imageKey exists
    const imageUrl = user.imageKey
      ? await this.awsService.getSignedUrl(user.imageKey)
      : null;

    return {
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        ...user,
        imageUrl, // Return the signed URL
      },
    };
  }

  async getProfileTopHeader(userId: string, activeRole: string) {
     const user = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            roles: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Profile not found');
    }

    // Generate signed URL for image if imageKey exists
    const imageUrl = user.imageKey
      ? await this.awsService.getSignedUrl(user.imageKey)
      : null;

    const { firstName, lastName } = user.user;
    return {
      success: true,
      message: 'Profile top header retrieved successfully',
      data: {
        firstName,
        lastName,
        imageUrl, // Return the signed URL
        activeRole
      },
    };
  }

  async getProfileImage(userId: string) {
    const user = await this.prisma.profile.findUnique({
      where: { userId },
      select: { imageKey: true },
    });

    if (!user || !user.imageKey) {
      throw new NotFoundException('Profile image not found');
    }

    const signedUrl = await this.awsService.getSignedUrl(user.imageKey);

    return {
      success: true,
      message: 'Profile image URL generated successfully',
      data: {
        imageUrl: signedUrl,
      },
    };
  }
}
