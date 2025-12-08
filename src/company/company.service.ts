import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class CompanyService {
  constructor(
    private prisma: PrismaService,
    private readonly awsService: AwsService,
  ) {}

  async createCompany(
    createCompanyDto: CreateCompanyDto,
    files?: Express.Multer.File[],
  ) {
    let documentList: any[] = [];

    console.log('Creating company with data:', createCompanyDto);

    // Upload each PDF to AWS — SAME LOGIC AS createCategory
    if (files && files.length > 0) {
      for (const file of files) {
        const { key, url } = await this.awsService.uploadFile(
          file,
          createCompanyDto.ownerUserId, // folder name (like createCategory uses name)
          'company-documents', // S3 main folder
        );

        documentList.push({
          key,
          url,
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        });
      }
    }

    console.log('Uploaded documents:', documentList);

    try {
      // 1. Create company
      const createdCompany = await this.prisma.company.create({
        data: {
          name: createCompanyDto.name,
          registrationNumber: createCompanyDto.registrationNumber,
          address: createCompanyDto.address,
          country: createCompanyDto.country,
          documents: documentList, // JSON array
          verificationStatus: 'PENDING',
        },
      });

      console.log('Company created:', createdCompany);

      // 2. Add relation in UserCompany
      await this.prisma.userCompany.create({
        data: {
          userId: createCompanyDto.ownerUserId,
          companyId: createdCompany.id,
          role: 'OWNER',
        },
      });

      return {
        success: true,
        message: 'Company created successfully',
        data: createdCompany,
        documents: documentList, // same style as createCategory returns imageUrl
      };
    } catch (error) {
      console.error('Error creating company:', error);
      throw new NotFoundException('Company creation failed');
    }
  }
}
