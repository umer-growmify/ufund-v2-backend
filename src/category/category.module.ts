import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AwsModule } from 'src/aws/aws.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [PrismaModule, AuthModule, AwsModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
