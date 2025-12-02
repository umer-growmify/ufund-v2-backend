import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { AdminRoleType, RoleType } from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly CompanyService: CompanyService) {}

  @Post('create')
  @Roles(RoleType.campaigner)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create Company' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.CompanyService.create(createCompanyDto);
  }
}
