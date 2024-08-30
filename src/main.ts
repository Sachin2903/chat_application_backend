import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const port=3636;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    credentials: true,
  });
  await app.listen(port);
  console.log(`Server is started at port: ${port}`)
}
bootstrap();
