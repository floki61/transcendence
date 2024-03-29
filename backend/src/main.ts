import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from "dotenv"

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: `http://${process.env.MY_IP}:3000`,
    credentials: true,
  }
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // app.useGlobalPipes(new ParseFilePipe({validators: [new MaxFileSizeValidator({maxSize: 1024 * 1024})]}));
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(4000);
}
bootstrap();
