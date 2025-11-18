import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
// import  cookieParser from 'cookie-parser';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('test kr raha hoon bhai n8n ko ma');

  app.use(cookieParser());
  // ✅ Handle multiple origins (local + env)
  const allowedOrigins = [
    'http://localhost:3000',
    process.env.CORS_ORIGIN,
  ].filter(Boolean); // removes undefined if env not set

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ✅ Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Ufund Project API')
    .setDescription('API documentation for Ufund project')
    .setVersion('1.0')
    .addTag('Ufund')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`Swagger Docs: http://localhost:${port}/api-docs`);
    console.log(`CORS allowed origins:`, allowedOrigins);
  });
}
bootstrap();
