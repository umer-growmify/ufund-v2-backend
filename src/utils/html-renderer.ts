/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
// import * as fs from 'fs';
// import * as path from 'path';
// import { baseVariables } from '../email/templates/base-variables';
// import { EMAIL_TEMPLATES } from '../email/templates/email-templates.config';

// export function renderEmail(
//   templateId: string,
//   variables: Record<string, any>,
// ) {
//   const config = EMAIL_TEMPLATES[templateId];

//   if (!config) {
//     throw new Error(`Unknown template: ${templateId}`);
//   }

//   // Load email-specific HTML (content-only)
//   const templatePath = path.join(
//     __dirname,
//     '../templates/html',
//     `${templateId}.html`,
//   );

//   const emailContent = fs.readFileSync(templatePath, 'utf8');

//   // Load master layout
//   const masterPath = path.join(__dirname, '../templates/html/master.html');
//   let masterHtml = fs.readFileSync(masterPath, 'utf8');

//   // Merge global + user variables
//   const finalVars = {
//     ...baseVariables,
//     ...variables,
//     content: emailContent,
//   };

//   // Replace variables in master layout
//   masterHtml = masterHtml.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
//     return finalVars[key] ?? '';
//   });

//   // Render subject
//   const subject = config.subject.replace(/{{(\w+)}}/g, (_, key) => {
//     return finalVars[key] ?? '';
//   });

//   return {
//     subject,
//     html: masterHtml,
//   };
// }

// import { baseVariables } from '../email/templates/base-variables';

// /**
//  * Render an email from HTML content stored in DB
//  * @param subjectTemplate Subject with {{variables}}
//  * @param htmlTemplate HTML content with {{variables}}
//  * @param variables Variables to inject
//  */
// export function renderEmailFromContent(
//   subjectTemplate: string,
//   htmlTemplate: string,
//   variables: Record<string, any>,
// ) {
//   // Merge base variables with dynamic variables
//   const finalVars = {
//     ...baseVariables,
//     ...variables,
//   };

//   // Replace variables in HTML
//   let html = htmlTemplate.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
//     return finalVars[key] ?? '';
//   });

//   // Replace variables in subject
//   const subject = subjectTemplate.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
//     return finalVars[key] ?? '';
//   });

//   return { html, subject };
// }
// src/utils/html-render.ts

import * as fs from 'fs';
import * as path from 'path';
import { baseVariables } from '../email/templates/base-variables';

/**
 * Renders an email by combining a master layout with content from the DB.
 * @param subject The email subject template with {{variables}}.
 * @param contentTemplate The email body content template with {{variables}}.
 * @param variables The variables to inject.
 * @returns The final subject and HTML for the email.
 */
export function renderEmailFromContent(
  subject: string,
  contentTemplate: string,
  variables: Record<string, any>
) {
  // 1. Merge all variables
  const finalVars = {
    ...baseVariables,
    ...variables,
  };

  // 2. Replace variables in the content template (e.g., the welcome message)
  let renderedContent = contentTemplate;
  for (const [key, value] of Object.entries(finalVars)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    renderedContent = renderedContent.replace(regex, String(value));
  }

  // 3. Load the master template from the file system
  // We use the same logic as your seeder to find the file reliably.
  let masterPath = path.join(__dirname, '../email/templates/html/master.html');
  if (!fs.existsSync(masterPath)) {
    masterPath = path.join(process.cwd(), 'src/email/templates/html/master.html');
  }
  
  if (!fs.existsSync(masterPath)) {
    throw new Error(`Master template not found at: ${masterPath}`);
  }

  let masterHtml = fs.readFileSync(masterPath, 'utf8');

  // 4. Inject the rendered content into the master template
  masterHtml = masterHtml.replace('{{{emailContent}}}', renderedContent);

  // 5. Replace variables in the master template (like {{subject}} in the <title> tag)
  for (const [key, value] of Object.entries(finalVars)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    masterHtml = masterHtml.replace(regex, String(value));
  }

  // 6. Replace variables in the subject line
  const finalSubject = subject.replace(/{{(\w+)}}/g, (match, key) => {
    return finalVars[key] || match;
  });

  return { subject: finalSubject, html: masterHtml };
}