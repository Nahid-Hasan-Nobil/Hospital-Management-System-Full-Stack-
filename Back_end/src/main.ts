// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // your Next.js frontend
    credentials: true, // allow cookies / auth headers
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
