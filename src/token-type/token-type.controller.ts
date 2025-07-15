import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TokenTypeService } from './token-type.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles, RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminRoleType, RoleType } from '@prisma/client';
import { CreateTokenTypeDto } from './dto/tokenType.dto';

@Controller('token-type')
export class TokenTypeController {
  constructor(private readonly tokenTypeService: TokenTypeService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN)
  createTokenType(@Body() createTokenTypeDto: CreateTokenTypeDto) {
    return this.tokenTypeService.createTokenType(createTokenTypeDto);
  }

  @Get('getalltokentype')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRoleType.SUPER_ADMIN, RoleType.campaigner)
  getAllTokenTypes() {
    return this.tokenTypeService.getAllTokenType();
  }
}
