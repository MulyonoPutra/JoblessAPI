import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './app/modules/auth/auth.module';
import { CategoryModule } from './app/modules/category/category.module';
import { CloudinaryModule } from './app/cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';
import { EmployerModule } from './app/modules/employer/employer.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from './app/prisma/prisma.module';
import { ProfileModule } from './app/modules/profile/profile.module';
import { SeekerModule } from './app/modules/seeker/seeker.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ProfileModule,
    EmployerModule,
    SeekerModule,
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
