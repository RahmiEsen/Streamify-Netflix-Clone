import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://streamify.rahmiesen.de',
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
