import { EMAIL_TEMPLATES } from '../email/templates/email-templates.config';

export function validateTemplateVariables(
  templateId: string,
  vars: Record<string, any>,
) {
  const config = EMAIL_TEMPLATES[templateId];

  for (const key in config.variables) {
    const def = config.variables[key];

    if (def.required === true && !vars[key]) {
      throw new Error(
        `Missing required variable "${key}" for template ${templateId}`,
      );
    }
  }
}
