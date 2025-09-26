import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/guards/roles.decorator';
import { AdminRoleType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('all-campaigners')
  @Roles(AdminRoleType.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'It will get all campaigners',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all campaigners',
  })
  async getAllCampaigners() {
    return this.userService.getAllCampaigners();
  }
}
