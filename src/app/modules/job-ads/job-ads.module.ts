import { JobAdsController } from './job-ads.controller';
import { JobAdsService } from './job-ads.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/app/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [JobAdsController],
	providers: [JobAdsService],
})
export class JobAdsModule {}
