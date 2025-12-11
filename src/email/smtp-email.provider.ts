/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
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
      host: process.env.MAILTRAP_HOST,   // Gmail SMTP
      port: Number(process.env.MAILTRAP_PORT ?? 587),
      secure: false, // Gmail uses STARTTLS
      auth: {
        user: process.env.MAILTRAP_USERNAME, // Gmail address
        pass: process.env.MAILTRAP_PASSWORD, // App password
      },
    });
  }

  async send(payload: EmailPayload): Promise<DeliveryResult> {
    const info = await this.transporter.sendMail({
      from: process.env.SMTP_FROM || '"UFUND" <no-reply@ufund.online>',
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

