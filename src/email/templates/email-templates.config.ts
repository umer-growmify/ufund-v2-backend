/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { commonUserVars } from './common-variables';

export type TemplateVariableDef = {
  description: string;
  required: boolean;
};

export type TemplateConfig = {
  description: null;
  name: string;
  htmlFileName: string;
  templateId: string;
  subject: string; // with placeholders, e.g. "Verify your {{appName}} email"
  variables: Record<string, TemplateVariableDef>;
};

export const EMAIL_TEMPLATES: Record<string, TemplateConfig> = {
  // 1. AUTH / ONBOARDING

  UFUND_AUTH_EMAIL_VERIFICATION_EN: {
    templateId: 'UFUND_AUTH_EMAIL_VERIFICATION_EN',
    subject: 'Verify your {{appName}} email address',
    htmlFileName: 'UFUND_AUTH_EMAIL_VERIFICATION_EN.html', // link to actual HTML
    variables: {
      ...commonUserVars(),
      verificationUrl: {
        description: 'Unique verification link for email confirmation',
        required: true,
      },
      expirationHours: {
        description: 'Validity duration of the verification link (e.g. 24)',
        required: true,
      },
    },
    description: null,
    name: 'verify email',
  },

  //welcome email

  UFUND_WELCOME_EN: {
    templateId: 'UFUND_WELCOME_EMAIL_EN',
    subject: 'Welcome to {{appName}}!',
    htmlFileName: 'UFUND_WELCOME_EMAIL_EN.html',
    variables: {
      ...commonUserVars(),
      dashboardUrl: {
        description: 'URL to the user dashboard',
        required: true,
      },
    },
    description: null,
    name: 'welcome email',
  },

  //password Reset email

  UFUND_AUTH_PASSWORD_RESET_EN: {
    templateId: 'UFUND_AUTH_PASSWORD_RESET_EN',
    subject: 'Reset your {{appName}} password',
    htmlFileName: 'UFUND_AUTH_PASSWORD_RESET_EN.html',
    variables: {
      ...commonUserVars(),
      resetUrl: {
        description: 'Unique password reset link',
        required: true,
      },
      expirationHours: {
        description: 'Validity duration of the reset link (e.g. 24)',
        required: true,
      },
    },
    description: null,
    name: 'password reset email',
  },

  // verification request recieved

  UFUND_KYC_SUBMITTED_EN: {
    templateId: 'UFUND_KYC_SUBMITTED_EN',
    subject: 'Your verification request has been received',
    htmlFileName: 'UFUND_KYC_SUBMITTED_EN.html',
    variables: {
      ...commonUserVars(),
      kycReference: {
        description: 'Internal reference or ticket number for KYC',
        required: true,
      },
    },
    description: null,
    name: 'kyc submitted email',
  },

  //account verified 

  UFUND_KYC_APPROVED_EN: {
    templateId: 'UFUND_KYC_APPROVED_EN',
    subject: 'Your {{appName}} account has been verified',
    htmlFileName: 'UFUND_KYC_APPROVED_EN.html',
    variables: {
      ...commonUserVars(),
      kycReference: {
        description: 'Internal reference number for KYC',
        required: true,
      },
    },
    description: null,
    name: 'kyc approved email',
  },

  // reject verification email

  UFUND_KYC_REJECTED_EN: {
    templateId: 'UFUND_KYC_REJECTED_EN',
    subject: 'Issue with your verification on {{appName}}',
    htmlFileName: 'UFUND_KYC_REJECTED_EN.html',
    variables: {
      ...commonUserVars(),
      kycReference: {
        description: 'Internal reference number for KYC',
        required: true,
      },
      rejectionReason: {
        description: 'Human readable reason (or summary) for rejection',
        required: true,
      },
      nextSteps: {
        description: 'Instructions for user to resubmit / provide documents',
        required: true,
      },
    },
    description: null,
    name: 'kyc rejected email',
  },

  //Role Switch

  UFUND_ROLE_SWITCH_APPROVED_EN: {
    templateId: 'UFUND_ROLE_SWITCH_APPROVED_EN',
    subject: 'Your role has been updated on {{appName}}',
    htmlFileName: 'UFUND_ROLE_SWITCH_APPROVED_EN.html',
    variables: {
      ...commonUserVars(),
      previousRole: {
        description: 'Previous role (e.g. "investor")',
        required: true,
      },
      newRole: {
        description: 'New role (e.g. "campaigner_company")',
        required: true,
      },
      profileUrl: {
        description: 'Direct link to profile / role management',
        required: true,
      },
    },
    description: null,
    name: 'role switch approved email',
  },

  //Admin Role Switch

  UFUND_ROLE_SWITCH_REQUESTED_ADMIN_EN: {
    templateId: 'UFUND_ROLE_SWITCH_REQUESTED_ADMIN_EN',
    subject: 'New role switch request: {{userFullName}}',
    htmlFileName: 'UFUND_ROLE_SWITCH_REQUESTED_ADMIN_EN.html',
    variables: {
      ...commonUserVars(),
      requestedRole: {
        description: 'Role requested by the user',
        required: true,
      },
      adminPanelUrl: {
        description: 'Link to admin panel to review request',
        required: true,
      },
    },
    description: null,
    name: 'role switch requested admin email',
  },

  // compaign approved email

  UFUND_CAMPAIGN_APPROVED_EN: {
    templateId: 'UFUND_CAMPAIGN_APPROVED_EN',
    subject: 'Your campaign "{{campaignName}}" has been approved',
    htmlFileName: 'UFUND_CAMPAIGN_APPROVED_EN.html',
    variables: {
      ...commonUserVars(),
      campaignName: {
        description: 'Name of the campaign',
        required: true,
      },
      campaignDashboardUrl: {
        description: 'Campaign owner dashboard URL',
        required: true,
      },
      targetAmount: {
        description: 'Target amount as formatted string (e.g. "€200,000")',
        required: true,
      },
      currencyCode: {
        description: 'Currency code (e.g. "EUR")',
        required: true,
      },
    },
    description: null,
    name: 'campaign approved email',
  },

  //compaign live email

  UFUND_CAMPAIGN_LIVE_EN: {
    templateId: 'UFUND_CAMPAIGN_LIVE_EN',
    subject: 'Your campaign "{{campaignName}}" is now LIVE',
    htmlFileName: 'UFUND_CAMPAIGN_LIVE_EN.html',
    variables: {
      ...commonUserVars(),
      campaignName: {
        description: 'Name of the campaign',
        required: true,
      },
      campaignPublicUrl: {
        description: 'Public campaign URL',
        required: true,
      },
      campaignDashboardUrl: {
        description: 'Campaign owner dashboard URL',
        required: true,
      },
    },
    description: null,
    name: 'campaign live email',
  },

  //compaign reject email

  UFUND_CAMPAIGN_REJECTED_EN: {
    templateId: 'UFUND_CAMPAIGN_REJECTED_EN',
    subject: 'Your campaign submission could not be approved',
    htmlFileName: 'UFUND_CAMPAIGN_REJECTED_EN.html',
    variables: {
      ...commonUserVars(),
      campaignName: {
        description: 'Name of the campaign',
        required: true,
      },
      rejectionReason: {
        description: 'Main reasons why the campaign was not approved',
        required: true,
      },
      nextSteps: {
        description: 'What the campaigner can do now',
        required: true,
      },
    },
    description: null,
    name: 'campaign rejected email',
  },

  // invested initiated email

  UFUND_INVESTMENT_INITIATED_EN: {
    templateId: 'UFUND_INVESTMENT_INITIATED_EN',
    subject: 'Your investment in "{{campaignName}}" is initiated',
    htmlFileName: 'UFUND_INVESTMENT_INITIATED_EN.html',
    variables: {
      ...commonUserVars(),
      campaignName: {
        description: 'Name of the campaign invested in',
        required: true,
      },
      investmentAmount: {
        description: 'Formatted amount string (e.g. "€5,000")',
        required: true,
      },
      currencyCode: {
        description: 'Currency code',
        required: true,
      },
      paymentMethod: {
        description: 'Payment method (e.g. "bank_transfer", "card")',
        required: true,
      },
      paymentInstructionsUrl: {
        description: 'URL with payment instructions or status',
        required: true,
      },
    },
    description: null,
    name: 'investment initiated email',
  },

  // payment confirmed email

  UFUND_PAYMENT_CONFIRMED_EN: {
    templateId: 'UFUND_PAYMENT_CONFIRMED_EN',
    subject: 'We have received your payment for "{{campaignName}}"',
    htmlFileName: 'UFUND_PAYMENT_CONFIRMED_EN.html',
    variables: {
      ...commonUserVars(),
      campaignName: {
        description: 'Name of the campaign',
        required: true,
      },
      investmentAmount: {
        description: 'Formatted amount string',
        required: true,
      },
      transactionReference: {
        description: 'Bank or internal transaction reference',
        required: true,
      },
      portfolioUrl: {
        description: 'Link to investor portfolio dashboard',
        required: true,
      },
    },
    description: null,
    name: 'payment confirmed email',
  },

  // investment completed email

  UFUND_INVESTMENT_COMPLETED_EN: {
    templateId: 'UFUND_INVESTMENT_COMPLETED_EN',
    subject: 'Your investment in "{{campaignName}}" is confirmed',
    htmlFileName: 'UFUND_INVESTMENT_COMPLETED_EN.html',
    variables: {
      ...commonUserVars(),
      campaignName: {
        description: 'Name of the campaign',
        required: true,
      },
      investmentAmount: {
        description: 'Formatted amount string',
        required: true,
      },
      equityOrTokenAmount: {
        description: 'Equity percentage or token amount if tokenized',
        required: false,
      },
      legalDocsUrl: {
        description: 'Link to subscription agreement, etc.',
        required: false,
      },
      portfolioUrl: {
        description: 'Link to investor portfolio',
        required: true,
      },
    },
    description: null,
    name: 'investment completed email',
  },

  // investment failed email

  UFUND_INVESTMENT_FAILED_EN: {
    templateId: 'UFUND_INVESTMENT_FAILED_EN',
    subject: 'Issue with your investment in "{{campaignName}}"',
    htmlFileName: 'UFUND_INVESTMENT_FAILED_EN.html',
    variables: {
      ...commonUserVars(),
      campaignName: {
        description: 'Name of the campaign',
        required: true,
      },
      investmentAmount: {
        description: 'Formatted amount string',
        required: true,
      },
      failureReason: {
        description: 'Brief explanation of the failure',
        required: true,
      },
      supportUrl: {
        description: 'Link to support or help center',
        required: false,
      },
    },
    description: null,
    name: 'investment failed email',
  },


  // UFUND_AUTH_WELCOME_EN: {
  //   templateId: 'UFUND_AUTH_WELCOME_EN',

  //   subject: 'Welcome to {{appName}}',

  //   variables: {
  //     ...commonUserVars(),
  //   },
  //   description: null,
  //   name: '',
  //   htmlFileName: '',
  // },

  // UFUND_AUTH_PASSWORD_RESET_EN: {
  //   templateId: 'UFUND_AUTH_PASSWORD_RESET_EN',

  //   subject: 'Reset your {{appName}} password',

  //   variables: {
  //     ...commonUserVars(),

  //     resetUrl: {
  //       description: 'Unique password reset link',

  //       required: true,
  //     },

  //     expirationHours: {
  //       description: 'Validity in hours for reset link',

  //       required: true,
  //     },
  //   },
  // },

  // // 2. KYC / COMPLIANCE

  // UFUND_KYC_SUBMITTED_EN: {
  //   templateId: 'UFUND_KYC_SUBMITTED_EN',

  //   subject: 'Your verification request has been received',

  //   variables: {
  //     ...commonUserVars(),

  //     kycReference: {
  //       description: 'Internal reference or ticket number for KYC',

  //       required: true,
  //     },
  //   },
  // },

  // UFUND_KYC_APPROVED_EN: {
  //   templateId: 'UFUND_KYC_APPROVED_EN',

  //   subject: 'Your {{appName}} account has been verified',

  //   variables: {
  //     ...commonUserVars(),

  //     kycReference: {
  //       description: 'Internal reference number for KYC',

  //       required: true,
  //     },
  //   },
  // },

  // UFUND_KYC_REJECTED_EN: {
  //   templateId: 'UFUND_KYC_REJECTED_EN',

  //   subject: 'Issue with your verification on {{appName}}',

  //   variables: {
  //     ...commonUserVars(),

  //     kycReference: {
  //       description: 'Internal reference number for KYC',

  //       required: true,
  //     },

  //     rejectionReason: {
  //       description: 'Human readable reason (or summary) for rejection',

  //       required: true,
  //     },

  //     nextSteps: {
  //       description: 'Instructions for user to resubmit / provide docs',

  //       required: true,
  //     },
  //   },
  // },

  // // 3. ROLE SWITCH / PROFILE

  // UFUND_ROLE_SWITCH_APPROVED_EN: {
  //   templateId: 'UFUND_ROLE_SWITCH_APPROVED_EN',

  //   subject: 'Your role has been updated on {{appName}}',

  //   variables: {
  //     ...commonUserVars(),

  //     previousRole: {
  //       description: 'Previous role (e.g. "investor")',

  //       required: true,
  //     },

  //     newRole: {
  //       description: 'New role (e.g. "campaigner_company")',

  //       required: true,
  //     },

  //     profileUrl: {
  //       description: 'Direct link to profile / role management',

  //       required: true,
  //     },
  //   },
  // },

  // UFUND_ROLE_SWITCH_REQUESTED_ADMIN_EN: {
  //   templateId: 'UFUND_ROLE_SWITCH_REQUESTED_ADMIN_EN',

  //   subject: 'New role switch request: {{userFullName}}',

  //   variables: {
  //     ...commonUserVars(),

  //     requestedRole: {
  //       description: 'Role requested by the user',

  //       required: true,
  //     },

  //     adminPanelUrl: {
  //       description: 'Link to admin panel to review request',

  //       required: true,
  //     },
  //   },
  // },

  // // 4. CAMPAIGN

  // UFUND_CAMPAIGN_APPROVED_EN: {
  //   templateId: 'UFUND_CAMPAIGN_APPROVED_EN',

  //   subject: 'Your campaign "{{campaignName}}" has been approved',

  //   variables: {
  //     ...commonUserVars(),

  //     campaignName: {
  //       description: 'Name of the campaign',

  //       required: true,
  //     },

  //     campaignDashboardUrl: {
  //       description: 'Campaign owner dashboard URL',

  //       required: true,
  //     },

  //     targetAmount: {
  //       description: 'Target amount as formatted string (e.g. "€200,000")',

  //       required: true,
  //     },

  //     currencyCode: {
  //       description: 'Currency code (e.g. "EUR")',

  //       required: true,
  //     },
  //   },
  // },

  // UFUND_CAMPAIGN_LIVE_EN: {
  //   templateId: 'UFUND_CAMPAIGN_LIVE_EN',

  //   subject: 'Your campaign "{{campaignName}}" is now LIVE',

  //   variables: {
  //     ...commonUserVars(),

  //     campaignName: {
  //       description: 'Name of the campaign',

  //       required: true,
  //     },

  //     campaignPublicUrl: {
  //       description: 'Public campaign URL',

  //       required: true,
  //     },

  //     campaignDashboardUrl: {
  //       description: 'Campaign owner dashboard URL',

  //       required: true,
  //     },
  //   },
  // },

  // UFUND_CAMPAIGN_REJECTED_EN: {
  //   templateId: 'UFUND_CAMPAIGN_REJECTED_EN',

  //   subject: 'Your campaign submission could not be approved',

  //   variables: {
  //     ...commonUserVars(),

  //     campaignName: {
  //       description: 'Name of the campaign',

  //       required: true,
  //     },

  //     rejectionReason: {
  //       description: 'Main reasons why the campaign was not approved',

  //       required: true,
  //     },

  //     nextSteps: {
  //       description: 'What the campaigner can do now',

  //       required: true,
  //     },
  //   },
  // },

  // // 5. INVESTMENT / PAYMENTS

  // UFUND_INVESTMENT_INITIATED_EN: {
  //   templateId: 'UFUND_INVESTMENT_INITIATED_EN',

  //   subject: 'Your investment in "{{campaignName}}" is initiated',

  //   variables: {
  //     ...commonUserVars(),

  //     campaignName: {
  //       description: 'Name of the campaign invested in',

  //       required: true,
  //     },

  //     investmentAmount: {
  //       description: 'Formatted amount string (e.g. "€5,000")',

  //       required: true,
  //     },

  //     currencyCode: {
  //       description: 'Currency code',

  //       required: true,
  //     },

  //     paymentMethod: {
  //       description: 'Payment method (e.g. "bank_transfer", "card")',

  //       required: true,
  //     },

  //     paymentInstructionsUrl: {
  //       description: 'URL with payment instructions or status',

  //       required: true,
  //     },
  //   },
  // },

  // UFUND_PAYMENT_CONFIRMED_EN: {
  //   templateId: 'UFUND_PAYMENT_CONFIRMED_EN',

  //   subject: 'We have received your payment for "{{campaignName}}"',

  //   variables: {
  //     ...commonUserVars(),

  //     campaignName: {
  //       description: 'Name of the campaign',

  //       required: true,
  //     },

  //     investmentAmount: {
  //       description: 'Formatted amount string',

  //       required: true,
  //     },

  //     transactionReference: {
  //       description: 'Bank or internal transaction reference',

  //       required: true,
  //     },

  //     portfolioUrl: {
  //       description: 'Link to investor portfolio dashboard',

  //       required: true,
  //     },
  //   },
  // },

  // UFUND_INVESTMENT_COMPLETED_EN: {
  //   templateId: 'UFUND_INVESTMENT_COMPLETED_EN',

  //   subject: 'Your investment in "{{campaignName}}" is confirmed',

  //   variables: {
  //     ...commonUserVars(),

  //     campaignName: {
  //       description: 'Name of the campaign',

  //       required: true,
  //     },

  //     investmentAmount: {
  //       description: 'Formatted amount string',

  //       required: true,
  //     },

  //     equityOrTokenAmount: {
  //       description: 'Equity percentage or token amount if tokenized',

  //       required: false,
  //     },

  //     legalDocsUrl: {
  //       description: 'Link to subscription agreement, etc.',

  //       required: false,
  //     },

  //     portfolioUrl: {
  //       description: 'Link to investor portfolio',

  //       required: true,
  //     },
  //   },
  // },

  // UFUND_INVESTMENT_FAILED_EN: {
  //   templateId: 'UFUND_INVESTMENT_FAILED_EN',

  //   subject: 'Issue with your investment in "{{campaignName}}"',

  //   variables: {
  //     ...commonUserVars(),

  //     campaignName: {
  //       description: 'Name of the campaign',

  //       required: true,
  //     },

  //     investmentAmount: {
  //       description: 'Formatted amount string',

  //       required: true,
  //     },

  //     failureReason: {
  //       description: 'Brief explanation of the failure',

  //       required: true,
  //     },

  //     supportUrl: {
  //       description: 'Link to support or help center',

  //       required: false,
  //     },
  //   },
  // },
};
