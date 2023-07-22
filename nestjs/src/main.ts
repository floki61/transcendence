import { NestFactory } from '@nestjs/core';
import { UsersModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  await app.listen(3000);
}
bootstrap();
