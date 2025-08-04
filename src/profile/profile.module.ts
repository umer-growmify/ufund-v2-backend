import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AwsModule } from 'src/aws/aws.module';
import { AuthHelperService } from 'src/utils/auth.helper';

@Module({
  imports: [PrismaModule, AuthModule, AwsModule],
  controllers: [ProfileController],
  providers: [ProfileService, AuthHelperService],
  exports: [ProfileService],
})
export class ProfileModule {}