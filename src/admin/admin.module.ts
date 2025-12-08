// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AuthHelperService } from '../utils/auth.helper';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [PrismaModule, AuthModule, EmailModule],
  controllers: [AdminController],
  providers: [AdminService, AuthHelperService],
  exports: [AdminService],
})
export class AdminModule {}
