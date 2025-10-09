import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://DEINE_FRONTEND_URL.vercel.app', // Später hier eintragen
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
