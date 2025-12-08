import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AwsModule } from 'src/aws/aws.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthHelperService } from 'src/utils/auth.helper';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [AwsModule, PrismaModule, AuthModule, EmailModule],
  controllers: [ProductsController],
  providers: [ProductsService, AuthHelperService],
})
export class ProductsModule {}
