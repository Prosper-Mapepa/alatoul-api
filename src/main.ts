import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Disable default to configure custom limits
  });

  // Get the underlying Express app to configure body parser limits
  const express = require('express');
  const expressApp = app.getHttpAdapter().getInstance();
  
  // Increase body size limit to handle base64 images (50MB)
  expressApp.use(express.json({ limit: '50mb' }));
  expressApp.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Enable CORS for frontend integration
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
  ].filter(Boolean);
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list or is a Railway domain
      if (
        allowedOrigins.includes(origin) ||
        origin.includes('.railway.app') ||
        origin.includes('.railway.tech')
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all origins for now, can be restricted later
      }
    },
    credentials: true,
  });

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Alatoul Backend API is running on: http://localhost:${port}/api`);
}
bootstrap();

