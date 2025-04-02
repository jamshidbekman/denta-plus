import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nValidationPipe, I18nValidationExceptionFilter } from 'nestjs-i18n';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

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

  const config = new DocumentBuilder()
    .setTitle('Denta Plus')
    .setDescription('Denta Plus API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document);

  const configService = app.get(ConfigService);

  console.log(await bcrypt.hash('Denta+777', 12));
  const PORT = configService.get('PORT') ?? 3000;
  await app.listen(PORT, () => {
    console.log('Server is running port', PORT);
  });
}
bootstrap();
