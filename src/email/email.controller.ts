import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailStatus } from '@prisma/client';

class PreviewEmailDto {
  templateId: string;
  variables: Record<string, any>;
}

class SendEmailDto {
  to: string;
  cc?: string[];
  bcc?: string[];
  templateId: string;
  variables: Record<string, any>;
  userId?: string;
  eventId?: string;
  metadata?: Record<string, any>;
}

class ResendEmailDto {
  emailLogId: string;
}

@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('preview')
  async preview(@Body() body: PreviewEmailDto) {
    const { templateId, variables } = body;

    const result = await this.emailService.preview(templateId, variables);

    return { templateId: result.templateId, html: result.html };
  }

  @Post('send')
  async send(@Body() body: SendEmailDto) {
    const result = await this.emailService.send(body);

    return result;
  }

  @Post('resend')
  async resend(@Body() body: ResendEmailDto) {
    return this.emailService.resend(body.emailLogId);
  }

  @Get('logs')
  async listLogs(
    @Query('userId') userId?: string,

    @Query('templateId') templateId?: string,

    @Query('eventId') eventId?: string,

    @Query('status') status?: EmailStatus,

    @Query('limit') limit = 20,

    @Query('offset') offset = 0,
  ) {
    return this.emailService.listLogs({
      userId,
      templateId,
      eventId,
      status,
      limit: Number(limit),
      offset: Number(offset),
    });
  }

  @Get('logs/:id')
  async getLog(@Param('id') id: string) {
    // small wrapper around prisma via emailService.listLogs or a dedicated method

    const { items } = await this.emailService.listLogs({ limit: 1, offset: 0 });

    const log = items.find((l) => l.id === id);

    return log;
  }
}
