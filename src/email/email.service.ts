// import { Inject, Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { EmailProvider } from '../types/email-provider.interface';
// import { EmailStatus } from '@prisma/client';
// import { renderEmail } from '../utils/html-renderer';

// interface SendEmailOptions {
//   to: string;
//   cc?: string[];
//   bcc?: string[];
//   templateId: string;
//   variables: Record<string, any>;
//   userId?: string;
//   eventId?: string;
//   metadata?: Record<string, any>;
// }

// @Injectable()
// export class EmailService {
//   constructor(
//     private readonly prisma: PrismaService,

//     @Inject('EmailProvider')
//     private readonly emailProvider: EmailProvider,
//   ) {}

//   async preview(templateId: string, variables: Record<string, any>) {
//     const template = await this.prisma.emailTemplate.findUnique({
//       where: { templateId },
//     });

//     if (!template || !template.isActive) {
//       throw new NotFoundException(`Template not found: ${templateId}`);
//     }

//     const { subject, html } = renderEmail(templateId, variables);

//     return { templateId, subject, html };
//   }

//   async send(options: SendEmailOptions) {
//     const template = await this.prisma.emailTemplate.findUnique({
//       where: { templateId: options.templateId },
//     });

//     if (!template || !template.isActive) {
//       throw new NotFoundException(`Template not found: ${options.templateId}`);
//     }

//     // NEW: Use master + content renderer
//     const { subject, html } = renderEmail(
//       options.templateId,
//       options.variables,
//     );

//     const log = await this.prisma.emailLog.create({
//       data: {
//         to: options.to,
//         cc: options.cc?.join(',') ?? null,
//         bcc: options.bcc?.join(',') ?? null,
//         templateId: options.templateId,
//         variables: options.variables,
//         status: EmailStatus.PENDING,
//         userId: options.userId ?? null,
//         eventId: options.eventId ?? null,
//       },
//     });

//     try {
//       const result = await this.emailProvider.send({
//         to: options.to,
//         cc: options.cc,
//         bcc: options.bcc,
//         subject,
//         html,
//         metadata: options.metadata,
//       });

//       await this.prisma.emailLog.update({
//         where: { id: log.id },
//         data: {
//           status: EmailStatus.SENT,
//           providerMessageId: result.providerMessageId ?? null,
//         },
//       });

//       return {
//         id: log.id,
//         status: EmailStatus.SENT,
//         providerMessageId: result.providerMessageId,
//       };
//     } catch (err) {
//       await this.prisma.emailLog.update({
//         where: { id: log.id },
//         data: {
//           status: EmailStatus.FAILED,
//           errorMessage: String(err?.message ?? 'Unknown error'),
//         },
//       });

//       throw err;
//     }
//   }

//   async resend(emailLogId: string) {
//     const log = await this.prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//     });

//     if (!log) {
//       throw new NotFoundException(`Email log not found: ${emailLogId}`);
//     }

//     return this.send({
//       to: log.to,
//       cc: log.cc ? log.cc.split(',') : undefined,
//       bcc: log.bcc ? log.bcc.split(',') : undefined,
//       templateId: log.templateId,
//       variables: log.variables as Record<string, any>,
//       userId: log.userId ?? undefined,
//       eventId: log.eventId ?? undefined,
//     });
//   }

//   async listLogs(params: {
//     userId?: string;
//     templateId?: string;
//     eventId?: string;
//     status?: EmailStatus;
//     limit?: number;
//     offset?: number;
//   }) {
//     const where: any = {};
//     if (params.userId) where.userId = params.userId;
//     if (params.templateId) where.templateId = params.templateId;
//     if (params.eventId) where.eventId = params.eventId;
//     if (params.status) where.status = params.status;

//     const [items, total] = await Promise.all([
//       this.prisma.emailLog.findMany({
//         where,
//         orderBy: { createdAt: 'desc' },
//         take: params.limit ?? 20,
//         skip: params.offset ?? 0,
//       }),
//       this.prisma.emailLog.count({ where }),
//     ]);

//     return { items, total };
//   }
// }

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailProvider } from '../types/email-provider.interface';
import { EmailStatus } from '@prisma/client';
import { renderEmailFromContent } from '../utils/html-renderer';

interface SendEmailOptions {
  to: string;
  cc?: string[];
  bcc?: string[];
  templateId: string;
  variables: Record<string, any>;
  userId?: string;
  eventId?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class EmailService {
  constructor(
    private readonly prisma: PrismaService,

    @Inject('EmailProvider')
    private readonly emailProvider: EmailProvider,
  ) {}

  /**
   * Preview email with variables, using HTML from DB
   */
  async preview(templateId: string, variables: Record<string, any>) {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { templateId },
    });

    if (!template || !template.isActive) {
      throw new NotFoundException(`Template not found: ${templateId}`);
    }

    const { subject, html } = renderEmailFromContent(
      template.subject,
      template.html,
      variables,
    );

    return { templateId, subject, html };
  }

  /**
   * Send email and log it
   */
  async send(options: SendEmailOptions) {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { templateId: options.templateId },
    });

    if (!template || !template.isActive) {
      throw new NotFoundException(`Template not found: ${options.templateId}`);
    }

    // Render using HTML from DB
    const { subject, html } = renderEmailFromContent(
      template.subject,
      template.html,
      options.variables,
    );

    // Create email log with PENDING status
    const log = await this.prisma.emailLog.create({
      data: {
        to: options.to,
        cc: options.cc?.join(',') ?? null,
        bcc: options.bcc?.join(',') ?? null,
        templateId: options.templateId,
        variables: options.variables,
        status: EmailStatus.PENDING,
        userId: options.userId ?? null,
        eventId: options.eventId ?? null,
      },
    });

    try {
      const result = await this.emailProvider.send({
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject,
        html,
        metadata: options.metadata,
      });

      await this.prisma.emailLog.update({
        where: { id: log.id },
        data: {
          status: EmailStatus.SENT,
          providerMessageId: result.providerMessageId ?? null,
        },
      });

      return {
        id: log.id,
        status: EmailStatus.SENT,
        providerMessageId: result.providerMessageId,
      };
    } catch (err) {
      await this.prisma.emailLog.update({
        where: { id: log.id },
        data: {
          status: EmailStatus.FAILED,
          errorMessage: String(err?.message ?? 'Unknown error'),
        },
      });

      throw err;
    }
  }

  /**
   * Resend a previously logged email
   */
  async resend(emailLogId: string) {
    const log = await this.prisma.emailLog.findUnique({
      where: { id: emailLogId },
    });

    if (!log) {
      throw new NotFoundException(`Email log not found: ${emailLogId}`);
    }

    return this.send({
      to: log.to,
      cc: log.cc ? log.cc.split(',') : undefined,
      bcc: log.bcc ? log.bcc.split(',') : undefined,
      templateId: log.templateId,
      variables: log.variables as Record<string, any>,
      userId: log.userId ?? undefined,
      eventId: log.eventId ?? undefined,
    });
  }

  /**
   * List email logs with filtering
   */
  async listLogs(params: {
    userId?: string;
    templateId?: string;
    eventId?: string;
    status?: EmailStatus;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    if (params.userId) where.userId = params.userId;
    if (params.templateId) where.templateId = params.templateId;
    if (params.eventId) where.eventId = params.eventId;
    if (params.status) where.status = params.status;

    const [items, total] = await Promise.all([
      this.prisma.emailLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: params.limit ?? 20,
        skip: params.offset ?? 0,
      }),
      this.prisma.emailLog.count({ where }),
    ]);

    return { items, total };
  }
}
