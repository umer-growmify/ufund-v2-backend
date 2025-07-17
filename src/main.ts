// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as cookieParser from 'cookie-parser';
// import { VersioningType } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.use(cookieParser());
//   app.enableCors({
//     origin: process.env.CORS_ORIGIN || '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     allowedHeaders: 'Content-Type, Accept, Authorization',
//   });

//   app.setGlobalPrefix('api');

//   app.enableVersioning({
//     type: VersioningType.URI,
//     defaultVersion: '1',
//   });

//   await app.listen(process.env.PORT ?? 3000, () => {
//     console.log(
//       `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
//     );
//   });
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // ✅ Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Ufund Project API')
    .setDescription('API documentation for Ufund project')
    .setVersion('1.0')
    .addTag('Ufund')
    .addBearerAuth() // If you're using JWT, otherwise remove
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`Swagger Docs: http://localhost:${port}/api-docs`);
  });
}
bootstrap();
