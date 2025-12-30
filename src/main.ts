import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Dictionary API')
    .setDescription('Blue Atlantic API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const theme = new SwaggerTheme();
  const darkCss = theme.getBuffer(SwaggerThemeNameEnum.DARK);

  console.log('🎨 Swagger theme loaded:', SwaggerThemeNameEnum.DARK);
  console.log('📏 CSS length:', darkCss.length);

  SwaggerModule.setup('api/docs', app, document, {
    customCss: darkCss.toString(),
    customSiteTitle: 'Blue Atlantic API Documentation',
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

  console.log('App listining to port:', process.env.PORT ?? 3000);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
