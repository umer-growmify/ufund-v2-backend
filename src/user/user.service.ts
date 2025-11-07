import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserStatusDto } from './dto/user.dto';
import { RoleType } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }
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
    const users = await this.prisma.user.findMany();

    if (users.length === 0) {
      return {
        success: true,
        message: 'No users found',
      };
    }

    if (!users) {
      throw new NotFoundException('No users found');
    }

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

  async switchUserRole(userId: string, currentRole: string, res: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Convert roles to lowercase for comparison
    const userRoles = user.roles.map((role) => role.toLowerCase());
    const hasCampaigner = userRoles.includes(RoleType.campaigner.toLowerCase());
    const hasInvestor = userRoles.includes(RoleType.investor.toLowerCase());

    console.log('User Roles:', userRoles);
    console.log('Has Campaigner:', hasCampaigner);
    console.log('Has Investor:', hasInvestor);

    if (!hasCampaigner || !hasInvestor) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      throw new BadRequestException(
        'User must have both campaigner and investor roles to switch',
      );
    }

    // Determine new role
    let newRole: RoleType;
    if (currentRole === RoleType.campaigner) {
      newRole = RoleType.investor;
    } else if (currentRole === RoleType.investor) {
      newRole = RoleType.campaigner;
    } else {
      throw new BadRequestException(`Invalid current role: ${currentRole}`);
    }

    // // Generate new JWT token
    // const payload = {
    //   id: user.id,
    //   email: user.email,
    //   activeRole: newRole,
    //   type: 'user',
    //   roles: user.roles,
    // };

    const payload = {
      sub: user.id,
      email: user.email,
      role: newRole,
      type: 'user',
    };

    console.log('JWT Payload:', payload);

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRY'),
    });

    console.log('Generated Access Token:', accessToken);

    // Clear old token and set new one
    res.clearCookie('accessToken', {
      httpOnly: false,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
    });

    console.log('Setting new access token cookie');

    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 1 * 60 * 1000,
    });

    console.log('New access token cookie set successfully');

    console.log('currentRole:', currentRole, 'newRole:', newRole);

    return {
      success: true,
      message: 'User role switched successfully',
      newRole: newRole,
    };
  }
}
