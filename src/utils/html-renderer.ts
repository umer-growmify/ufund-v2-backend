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

import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { baseVariables } from '../email/templates/base-variables';

export function renderEmailFromContent(
  subjectTemplate: string,
  htmlTemplate: string,
  variables: Record<string, any>,
) {
  const finalVars = {
    ...baseVariables,
    ...variables,
  };

  // 1️⃣ Compile the INNER TEMPLATE (important!)
  const innerTemplate = Handlebars.compile(htmlTemplate);
  const compiledInnerHtml = innerTemplate(finalVars);

  // 2️⃣ Load master layout
  const masterPath = path.join(
    process.cwd(),
    'src/email/templates/html/master.html',
  );

  let masterHtml = '{{{content}}}';
  if (fs.existsSync(masterPath)) {
    masterHtml = fs.readFileSync(masterPath, 'utf-8');
  }

  // 3️⃣ Compile master with inner HTML injected
  const master = Handlebars.compile(masterHtml);
  const html = master({
    ...finalVars,
    content: compiledInnerHtml, // inner content goes here
  });

  // 4️⃣ Compile subject
  const compiledSubject = Handlebars.compile(subjectTemplate);
  const subject = compiledSubject(finalVars);

  return { html, subject };
}