/* eslint-disable prettier/prettier */
import { TemplateVariableDef } from '../../types/email-provider.interface';

export function commonUserVars(): Record<string, TemplateVariableDef> {
  return {
    firstName: {
      description: 'User first name',
      required: false,
    },
    lastName: {
      description: 'User last name',
      required: false,
    },
    userFullName: {
      description: 'User full name',
      required: false,
    },
  };
}
