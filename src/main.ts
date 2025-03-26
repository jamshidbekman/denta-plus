import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nValidationPipe, I18nValidationExceptionFilter } from 'nestjs-i18n';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      whitelist: true,
    }),
    new ValidationPipe(),
  );

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      // detailedErrors: true,
    }),
  );

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') ?? 3000;
  await app.listen(PORT, () => {
    console.log('Server is running port', PORT);
  });
}
bootstrap();
