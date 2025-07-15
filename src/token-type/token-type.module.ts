import { Module } from '@nestjs/common';
import { TokenTypeService } from './token-type.service';
import { TokenTypeController } from './token-type.controller';

@Module({
  controllers: [TokenTypeController],
  providers: [TokenTypeService],
})
export class TokenTypeModule {}
