import { AppModule } from './app.module';
import { FormatResponseInterceptor } from './app/common/interceptors/format-response.interceptor';
import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new FormatResponseInterceptor());
    app.enableCors({
        origin: '*',
        methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    app.enableVersioning({
        type: VersioningType.URI,
    });

    app.setGlobalPrefix('api/v1');
    await app.listen(3000);
}
bootstrap();
