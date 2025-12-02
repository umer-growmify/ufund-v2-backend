import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { AdminModule } from './admin/admin.module';
import { CategoryModule } from './category/category.module';
import { ProductsModule } from './products/products.module';
import { AssetModule } from './asset/asset.module';
import { AwsModule } from './aws/aws.module';
import { UserModule } from './user/user.module';
import { CampaignerModule } from './campaigner/campaigner.module';
import { InvestorModule } from './investor/investor.module';

import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ProfileModule,
    AdminModule,
    CategoryModule,
    ProductsModule,
    AssetModule,
    AwsModule,
    UserModule,
    CampaignerModule,
    InvestorModule,
    CompanyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
