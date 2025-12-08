import { Global, Module } from '@nestjs/common';

import { EmailService } from './email.service';

import { EmailController } from './email.controller';

import { PrismaService } from '../prisma/prisma.service';

import { SmtpEmailProvider } from './smtp-email.provider';

import { EmailProvider } from '../types/email-provider.interface';

@Module({
  controllers: [EmailController],
  providers: [
    PrismaService,
    EmailService,
    {
      provide: 'EmailProvider',
      useClass: SmtpEmailProvider,
    },
  ],
  exports: [EmailService, 'EmailProvider'],
})
export class EmailModule {}
