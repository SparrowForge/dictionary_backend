/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { delimiter, join } from 'path';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

import { JwtAuthOrPublicGuard } from './common/guards/jwt-auth-or-public.guard';
import { Request, Response } from 'express';

async function createApp(): Promise<NestExpressApplication> {
  // TypeScript preserves the project's `src/...` imports in the emitted JavaScript.
  // Add the source directory to Node's lookup path before loading AppModule.
  const nodeModule = require('node:module') as {
    Module: { _initPaths: () => void };
  };
  process.env.NODE_PATH = [
    join(process.cwd(), 'src'),
    process.env.NODE_PATH,
  ]
    .filter(Boolean)
    .join(delimiter);
  nodeModule.Module._initPaths();

  const { AppModule } = await import('./app.module.js');
  console.log('🚀 Starting Dictionary API server...');
  console.log('📂 Environment:', process.env.NODE_ENV);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
    exposedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    credentials: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Register global guard for JWT or public
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthOrPublicGuard(reflector));

  // Serve uploaded files statically
  const uploadBaseDir =
    process.env.UPLOAD_BASE_DIR || join(__dirname, '..', 'uploads');
  app.useStaticAssets(uploadBaseDir, {
    prefix: '/uploads/',
    setHeaders: (res: import('express').Response, path: string) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache
    },
  });

  const publicBaseDir = join(__dirname, '..', 'public');
  app.useStaticAssets(publicBaseDir, {
    prefix: '/public/',
    setHeaders: (res: import('express').Response) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache
    },
  });


  const config = new DocumentBuilder()
    .setTitle('Dictionary API')
    .setDescription('Dictionary API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const theme = new SwaggerTheme();
  const darkCss = theme.getBuffer(SwaggerThemeNameEnum.CLASSIC);

  console.log('🎨 Swagger theme loaded:', SwaggerThemeNameEnum.CLASSIC);
  console.log('📏 CSS length:', darkCss.length);

  SwaggerModule.setup('api/docs', app, document, {
    customCss: darkCss.toString(),
    customSiteTitle: 'Dictionary API Documentation',
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      displayRequestDuration: true,
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
    customfavIcon: '/favicon.ico',
  });

  await app.init();
  return app;
}

// Vercel invokes the exported handler; the droplet starts the HTTP listener below.
let appPromise: Promise<NestExpressApplication> | undefined;

export default async function handler(req: Request, res: Response): Promise<void> {
  appPromise ??= createApp();
  const app = await appPromise;
  app.getHttpAdapter().getInstance()(req, res);
}

if (!process.env.VERCEL) {
  void createApp().then((app) => {
    console.log('App listening on port:', process.env.PORT ?? 3000);
    return app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  });
}
