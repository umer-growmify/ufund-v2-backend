import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCompanyDto) {
    const { ownerUserId, ...companyData } = dto;

    // 1. Create the company
    const company = await this.prisma.company.create({
      data: {
        ...companyData,
        verificationStatus: 'PENDING',
      },
    });

    // 2. Add UserCompany relation with role OWNER
    await this.prisma.userCompany.create({
      data: {
        userId: ownerUserId,
        companyId: company.id,
        role: 'OWNER',
      },
    });

    return company;
  }
}
