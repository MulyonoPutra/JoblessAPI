import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/app/prisma/prisma.module';
import { SeekerController } from './seeker.controller';
import { SeekerService } from './seeker.service';

@Module({
	imports: [PrismaModule],
	controllers: [SeekerController],
	providers: [SeekerService],
})
export class SeekerModule {}
