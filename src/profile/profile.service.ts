import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AwsService } from 'src/aws/aws.service';
import { UpdateProfileUserDto } from 'src/auth/dto/auth.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
  ) {}

  async createAndUpdateProfile(
    createProfile: CreateProfileDto,
    updateProfile: UpdateProfileDto,
    userId: string,
    file?: Express.Multer.File,
  ) {
    console.log('createAndUpdateProfile - User ID:', updateProfile);

    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    console.log(file, 'file in service');

    if (!existingProfile) {
      // Upload file to S3 if provided
      let imageKey: string | undefined;
      let imageUrl: string | undefined;

      if (file) {
        const { key, url } = await this.awsService.uploadFile(
          file,
          userId,
          'profiles',
        );
        imageKey = key;
        imageUrl = url;
      }

      console.log('Image Key:', imageKey);

      // Create new profile
      const userCreated = await this.prisma.profile.create({
        data: {
          userId,
          imageKey,
          ...createProfile,
        },
      });

      return {
        success: true,
        message: 'Profile created successfully',
        userCreated,
        imageUrl,
      };
    } else {
      let newImageKey = existingProfile.imageKey;

      const hasFileUpdate = !!file;
      const hasDtoUpdate = Object.keys(updateProfile).length > 0;

      if (!hasFileUpdate && !hasDtoUpdate) {
        throw new BadRequestException(
          'No changes detected for update operation.',
        );
      }

      if (hasFileUpdate) {
        if (!newImageKey) {
          throw new BadRequestException('No existing image to update.');
        }
        const { key, url } = await this.awsService.updateFile(
          file,
          newImageKey,
        );
        newImageKey = key;
      }

      const updatedProfile = await this.prisma.profile.update({
        where: { userId },
        data: {
          ...(hasFileUpdate && { imageKey: newImageKey }),
          ...(hasDtoUpdate && updateProfile),
        },
      });

      if (!updatedProfile.imageKey) {
        throw new BadRequestException('No image key found for this profile.');
      }
      const imageUrl = await this.awsService.getSignedUrl(
        updatedProfile.imageKey,
      );

      return {
        success: true,
        message: 'Profile updated successfully',
        updatedProfile,
        imageUrl,
      };
    }
  }

  async updateProfileUser(
    userId: string,
    updateProfileUserDto: UpdateProfileUserDto,
  ) {
    // check the user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    // update just those fields which user want
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateProfileUserDto,
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  }

  async getProfile(userId: string) {
    console.log('Getting profile for user ID:', userId);

    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    console.log('user profile service ', user);

    if (!user) {
      throw new NotFoundException('Profile not found');
    }

    // Generate signed URL for image if imageKey exists
    const imageUrl = user.profile?.imageKey
      ? await this.awsService.getSignedUrl(user.profile.imageKey)
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
        activeRole,
      },
    };
  }

  async createUpdateProfileUser(
    userId: string,
    data: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { user: true }, // Get current profile+user data
    });

    console.log('data ', data);

    if (existingProfile) {
      // Profile exists - UPDATE scenario
      let imageKey: string | undefined;
      let imageUrl: string | undefined;

      if (file) {
        const { key, url } = await this.awsService.updateFile(
          file,
          existingProfile.imageKey!,
        );
        imageKey = key;
        imageUrl = url;
      }

      const userData = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        countryCode: data.countryCode,
      };

      console.log('User Data:', userData);

      // Only include imageKey if it's defined (file was uploaded)
      const profileData: any = {
        userAccountType: data.userAccountType,
        incomeFrequency: data.incomeFrequency,
        totalAnnualRevenue: data.totalAnnualRevenue,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        zipCode: data.zipCode,
        city: data.city,
        state: data.state,
        country: data.country,
        companyName: data.companyName,
        companyEmail: data.companyEmail,
        companyTelephone: data.companyTelephone,
        companyAddress: data.companyAddress,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        routingNumber: data.routingNumber,
        ibanNumber: data.ibanNumber,
        swiftNumber: data.swiftNumber,
        bankAccountType: data.bankAccountType,
        bankAddress: data.bankAddress,
      };

      // Only add imageKey if we have a new image
      if (imageKey) {
        profileData.imageKey = imageKey;
      }

      console.log('Profile Data:', profileData);

      // Update both user and profile in a transaction
      const [updatedUser, updatedProfile] = await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: userId },
          data: userData,
        }),
        this.prisma.profile.update({
          where: { userId },
          data: profileData,
        }),
      ]);

      // Fetch updated profile with user data
      const freshProfile = await this.prisma.profile.findUnique({
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

      return {
        success: true,
        message: 'Profile updated successfully',
        existingProfile: freshProfile,
        imageUrl,
      };
    } else {
      let imageKey: string | undefined;
      let imageUrl: string | undefined;

      if (file) {
        const { key, url } = await this.awsService.uploadFile(
          file,
          userId,
          'profiles',
        );
        imageKey = key;
        imageUrl = url;
      }

      const userData = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        countryCode: data.countryCode,
      };

      console.log('User Data:', userData);

      // Build profile data with required fields having default values
      const profileData = {
        userId: userId, // This is required for profile creation
        imageKey: imageKey,
        userAccountType: data.userAccountType, // Has default in schema
        incomeFrequency: data.incomeFrequency, // Has default in schema
        totalAnnualRevenue: data.totalAnnualRevenue, // Has default in schema
        // Required fields - provide empty string if undefined
        addressLine1: data.addressLine1 || '',
        addressLine2: data.addressLine2,
        zipCode: data.zipCode || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        companyName: data.companyName || '',
        companyEmail: data.companyEmail || '',
        companyTelephone: data.companyTelephone || '',
        companyAddress: data.companyAddress || '',
        bankName: data.bankName || '',
        accountNumber: data.accountNumber || '',
        accountName: data.accountName || '',
        routingNumber: data.routingNumber || '',
        ibanNumber: data.ibanNumber || '',
        swiftNumber: data.swiftNumber || '',
        bankAccountType: data.bankAccountType, // Has default in schema
        bankAddress: data.bankAddress || '',
      };

      console.log('Profile Data:', profileData);

      // Update user and create profile in a transaction
      const [updatedUser, createdProfile] = await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: userId },
          data: userData,
        }),
        this.prisma.profile.create({
          data: profileData,
        }),
      ]);

      const freshProfile = await this.prisma.profile.findUnique({
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

      return {
        success: true,
        message: 'Profile created successfully',
        existingProfile: freshProfile,
        imageUrl,
      };
    }
  }

  async updateCompleteProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    console.log('hello');

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { profile } = user;
    const hasFileUpdate = !!file;
    const hasDtoUpdate = Object.keys(updateProfileDto).length > 0;

    if (!hasFileUpdate && !hasDtoUpdate) {
      throw new BadRequestException(
        'No changes detected for update operation.',
      );
    }

    let imageKey: string | undefined;
    let imageUrl: string | undefined;

    // Handle file upload/update
    if (hasFileUpdate) {
      if (profile?.imageKey) {
        // Update existing file
        const result = await this.awsService.updateFile(file, profile.imageKey);
        imageKey = result.key;
        imageUrl = result.url;
      } else {
        // Upload new file
        const result = await this.awsService.uploadFile(
          file,
          userId,
          'profiles',
        );
        imageKey = result.key;
        imageUrl = result.url;
      }
    }

    // Prepare user data
    const userData = {
      email: updateProfileDto.email,
      firstName: updateProfileDto.firstName,
      lastName: updateProfileDto.lastName,
      phoneNumber: updateProfileDto.phoneNumber,
      countryCode: updateProfileDto.countryCode,
    };

    // Prepare profile data
    const profileData: any = {
      userAccountType: updateProfileDto.userAccountType,
      incomeFrequency: updateProfileDto.incomeFrequency,
      totalAnnualRevenue: updateProfileDto.totalAnnualRevenue,
      addressLine1: updateProfileDto.addressLine1,
      addressLine2: updateProfileDto.addressLine2,
      zipCode: updateProfileDto.zipCode,
      city: updateProfileDto.city,
      state: updateProfileDto.state,
      country: updateProfileDto.country,
      companyName: updateProfileDto.companyName,
      companyEmail: updateProfileDto.companyEmail,
      companyTelephone: updateProfileDto.companyTelephone,
      companyAddress: updateProfileDto.companyAddress,
      bankName: updateProfileDto.bankName,
      accountNumber: updateProfileDto.accountNumber,
      accountName: updateProfileDto.accountName,
      routingNumber: updateProfileDto.routingNumber,
      ibanNumber: updateProfileDto.ibanNumber,
      swiftNumber: updateProfileDto.swiftNumber,
      bankAccountType: updateProfileDto.bankAccountType,
      bankAddress: updateProfileDto.bankAddress,
    };

    // Add imageKey if we have a new image
    if (imageKey) {
      profileData.imageKey = imageKey;
    }

    // Use transaction for atomic updates
    const [updatedUser, updatedOrCreatedProfile] =
      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: userId },
          data: userData,
        }),
        profile
          ? this.prisma.profile.update({
              where: { userId },
              data: profileData,
            })
          : this.prisma.profile.create({
              data: {
                userId,
                ...profileData,
              },
            }),
      ]);

    // Get fresh data with relations
    const freshProfile = await this.prisma.profile.findUnique({
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

    return {
      success: true,
      message: profile
        ? 'Profile updated successfully'
        : 'Profile created successfully',
      data: freshProfile,
      imageUrl:
        imageUrl ||
        (freshProfile?.imageKey
          ? await this.awsService.getSignedUrl(freshProfile.imageKey)
          : null),
    };
  }
}
