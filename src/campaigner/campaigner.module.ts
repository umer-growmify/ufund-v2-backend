import { Module } from '@nestjs/common';
import { CampaignerService } from './campaigner.service';
import { CampaignerController } from './campaigner.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthHelperService } from 'src/utils/auth.helper';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [PrismaModule, AuthModule, EmailModule],
  controllers: [CampaignerController],
  providers: [CampaignerService],
  exports: [CampaignerService],
})
export class CampaignerModule {}
