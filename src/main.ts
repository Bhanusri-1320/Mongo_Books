/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { createMap } from '@automapper/core';
import { mapper } from './book/mappers/mapper';
import { Book } from './book/schemas/book.schema';
import { createBookDto } from './book/dto/create-book.dto';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    // .setTitle(process.env.SWGGER_TITLE)
    .setDescription(process.env.SWAGGER_DESCRIPTION)
    // .setVersion(process.env.SWAGGER_VERSION)
    // .addTag(process.env.SWAGGER_TAG)
    .addBearerAuth() // Add Bearer auth
    .build(); // creates the API documentation based on above settings

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);
  createMap(mapper, Book, createBookDto);
}
bootstrap();
