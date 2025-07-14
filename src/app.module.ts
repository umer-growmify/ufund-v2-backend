import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { AdminModule } from './admin/admin.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [AuthModule, ProfileModule, AdminModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
