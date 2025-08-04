import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthHelperService } from 'src/utils/auth.helper';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AssetController],
  providers: [AssetService,AuthHelperService],
  
})
export class AssetModule {}
