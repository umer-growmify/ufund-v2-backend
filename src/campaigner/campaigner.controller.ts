import { Controller, Get, UseGuards } from '@nestjs/common';
import { CampaignerService } from './campaigner.service';
import { Roles } from 'src/auth/guards/roles.decorator';
import { RoleType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { time } from 'console';

@Controller('campaigner')
export class CampaignerController {
  constructor(private readonly campaignerService: CampaignerService) {}
  @Get('dashboard')
  @Roles(RoleType.campaigner)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Campaigner Dashboard' })
  @ApiResponse({ status: 200, description: 'Campaigner Dashboard' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  campaignerDashboard() {
    return this.campaignerService.campaignerDashboard();
  }
}
