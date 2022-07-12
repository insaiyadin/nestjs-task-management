import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    const logger = new Logger();
    const PORT = 3000
    await app.listen(PORT);
    logger.log(`App listening on ${PORT}`);
}
bootstrap();
