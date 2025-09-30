import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
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
import { UpdateUserStatusDto } from './dto/user.dto';

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

  // pdate user status

  @Put('update-user-status/:id')
  @Roles(AdminRoleType.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'It will update user status',
  })
  @ApiResponse({
    status: 200,
    description: 'User status updated successfully',
  })
  async updateUserStatus(
    @Param('id') userId: string,
    @Body() status: UpdateUserStatusDto,
  ) {
    return this.userService.updateUserStatus(userId, status);
  }

  @Get('all-users')
  @Roles(AdminRoleType.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'It will get all users',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
  })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Delete('delete-user/:id')
  @Roles(AdminRoleType.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'It will delete user',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  async deteleUser(@Param('id') userId: string) {
    return this.userService.deteleUser(userId);
  }
}
