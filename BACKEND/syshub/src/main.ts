import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

console.log("primer proyecto en nestjs...")
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();//Activar cors para diferentes puertos
  app.useGlobalPipes(new ValidationPipe());//Activar validaciones globales

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();