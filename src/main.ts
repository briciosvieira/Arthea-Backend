import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: [
      // desenvolvimento local
      'http://localhost:3001',
      'http://localhost:8080',
      // produção — cobre http/https e com/sem www
      /^https?:\/\/(www\.)?clinicaarthea\.com\.br$/,
      /^https?:\/\/(www\.)?artheaconsultorio\.com\.br$/,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
