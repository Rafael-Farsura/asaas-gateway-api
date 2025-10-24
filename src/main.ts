import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { setupCors } from 'src/domain/payments/asaas/config/cors.config';
import { AppModule } from './app.module';
import { setupSwagger } from './domain/payments/asaas/config/swagger.config';
import { json, raw } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  
  app.use('/stripe/webhook', raw({ type: 'application/json' }));
  app.use(json());

  setupSwagger(app);
  setupCors(app);
  
  const port = configService.get<number>('PORT') || 8000;
  await app.listen(port);
}

bootstrap()
  .then(() => {
    console.log(`Server listening on port ${process.env.PORT}
    Access the API at http://localhost:${process.env.PORT}
    `);
  })
  .catch((err) => {
    console.log(`Could not start the server :( \n ${err}`);
  });
