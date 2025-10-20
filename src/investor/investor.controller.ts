import { Controller, Get, UseGuards } from '@nestjs/common';
import { InvestorService } from './investor.service';
import { Roles } from 'src/auth/guards/roles.decorator';
import { RoleType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('investor')
export class InvestorController {
  constructor(private readonly investorService: InvestorService) {}
  @Get('dashboard')
  @Roles(RoleType.investor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get Investor Dashboard' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  investorDashboard() {
    return this.investorService.investorDashboard();
  }
}
