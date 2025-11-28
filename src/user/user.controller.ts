import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Put,
  Req,
  Res,
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
import { AdminRoleType, RoleType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RequestRoleDto, UpdateUserStatusDto } from './dto/user.dto';
import { RequestWithUser } from 'src/types/types';
import { Response } from 'express';

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

  // secondrole request
  @Patch('/:id/request-role')
  async requestRole(@Param('id') userId: string, @Body() dto: RequestRoleDto) {
    return this.userService.requestRole(userId, dto);
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

  @Post('switch-user-role')
  @ApiOperation({ summary: 'Switch user role (campaigner <-> investor)' })
  @ApiResponse({ status: 200, description: 'User role switched successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.campaigner, RoleType.investor)
  async switchUserRole(@Req() req: RequestWithUser, @Res() res: Response) {
    console.log(req.user);
    const userId = req.user.id;
    const userRole = req.user.activeRole;

    // Call the service method and pass the response object
    const result = await this.userService.switchUserRole(userId, userRole, res);

    console.log(result);

    res.status(200).json(result);

    // Send the res
  }
}
