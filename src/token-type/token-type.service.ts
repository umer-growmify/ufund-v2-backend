import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTokenTypeDto } from './dto/tokenType.dto';

@Injectable()
export class TokenTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async createTokenType(createTokenTypeDto: CreateTokenTypeDto) {
    try {
      const createTokenType = await this.prisma.assetType.create({
        data: {
          name: createTokenTypeDto.name,
        },
      });
      return {
        success: true,
        message: 'Token Type created successfully',
        data: createTokenType,
      };
    } catch (error) {
      throw new NotFoundException('Token Type creation failed');
    }
  }

  async getAllTokenType (){
     try {
      const getAllTokenType = await this.prisma.assetType.findMany();
      return {
        success: true,
        message: 'Token Types retrieved Succefully',
        data: getAllTokenType,
      };
    } catch (error) {
      throw new NotFoundException('No Token Types Found');
    }
  }
}
