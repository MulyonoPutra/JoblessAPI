import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './app/modules/auth/auth.module';
import { CloudinaryModule } from './app/cloudinary/cloudinary.module';
import { CompanyModule } from './app/modules/company/company.module';
import { ConfigModule } from '@nestjs/config';
import { EmployerModule } from './app/modules/employer/employer.module';
import { JobAdsModule } from './app/modules/job-ads/job-ads.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from './app/prisma/prisma.module';
import { ProfileModule } from './app/modules/profile/profile.module';
import { SeekerModule } from './app/modules/seeker/seeker.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
	imports: [
		CompanyModule,
		JobAdsModule,
		ProfileModule,
		EmployerModule,
		SeekerModule,
		AuthModule,
		PrismaModule,
		ConfigModule.forRoot({ isGlobal: true }),
		CloudinaryModule,
		// ServeStaticModule.forRoot({
		//   rootPath: join(__dirname, '..', 'public'),
		// }),

		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'uploads'),
			serveRoot: '/uploads',
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
