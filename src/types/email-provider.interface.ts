export interface EmailPayload {
  to: string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
  metadata?: Record<string, any>;
}
export interface DeliveryResult {
  providerMessageId?: string;
}
export interface EmailProvider {
  send(payload: EmailPayload): Promise<DeliveryResult>;
}

export type TemplateVariableDef = {
  description: string;
  required: boolean;
};

export type TemplateConfig = {
  templateId: string;
  subject: string;
  variables: Record<string, TemplateVariableDef>;
};
