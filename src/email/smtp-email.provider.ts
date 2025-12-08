import { Injectable, Logger } from '@nestjs/common';

import * as nodemailer from 'nodemailer';

import {
  EmailProvider,
  EmailPayload,
  DeliveryResult,
} from '../types/email-provider.interface';

@Injectable()
export class SmtpEmailProvider implements EmailProvider {
  private readonly logger = new Logger(SmtpEmailProvider.name);

  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST, // e.g. smtp.dreamhost.com

      port: Number(process.env.MAILTRAP_PORT ?? 587),

      secure: false,

      auth: {
        user: process.env.MAILTRAP_USERNAME,

        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  }

  async send(payload: EmailPayload): Promise<DeliveryResult> {
    const info = await this.transporter.sendMail({
      from: process.env.EMAIL_FROM || '"UFUND" <no-reply@ufund.online>',

      to: payload.to,

      cc: payload.cc,

      bcc: payload.bcc,

      subject: payload.subject,

      html: payload.html,
    });

    this.logger.log(`Email sent: ${info.messageId} to=${payload.to}`);

    return { providerMessageId: info.messageId };
  }
}
