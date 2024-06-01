import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './app/modules/auth/auth.module';
import { CategoryModule } from './app/modules/category/category.module';
import { CloudinaryModule } from './app/cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PrismaModule } from './app/prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    CategoryModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CloudinaryModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
