import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { EMAIL_TEMPLATES } from '../src/email/templates/email-templates.config';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Seeding Email Templates...\n');

  for (const key in EMAIL_TEMPLATES) {
    const t = EMAIL_TEMPLATES[key];

    // Resolve HTML path
    let htmlPath = path.join(
      __dirname,
      '../src/email/templates/html',
      t.htmlFileName,
    );

    if (!fs.existsSync(htmlPath)) {
      // Try running from source (ts-node)
      const devPath = path.join(
        process.cwd(),
        'src/email/templates/html',
        t.htmlFileName,
      );
      if (!fs.existsSync(devPath)) {
        console.error(`❌ Missing HTML file for template: ${t.templateId}`);
        continue;
      }
      htmlPath = devPath;
    }

    // if (!fs.existsSync(htmlPath)) {
    //   console.error(`❌ Missing HTML file: ${htmlPath}`);
    //   continue;
    // }

    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

    await prisma.emailTemplate.upsert({
      where: { templateId: t.templateId },
      create: {
        templateId: t.templateId,
        name: t.name || t.templateId,
        description: t.description || null,
        subject: t.subject,
        html: htmlContent,
        htmlFileName: t.htmlFileName,
      },
      update: {
        name: t.name || t.templateId,
        description: t.description || null,
        subject: t.subject,
        html: htmlContent,
        htmlFileName: t.htmlFileName,
      },
    });

    console.log(`✅ Seeded: ${t.templateId}`);
  }

  console.log('\n🎉 Email templates seeding completed!');
}

main()
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());