import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { AdminRoleType, RoleType } from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly CompanyService: CompanyService) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('documents'))
  async createCompany(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateCompanyDto,
  ) {
    return this.CompanyService.createCompany(body, files);
  }
}
