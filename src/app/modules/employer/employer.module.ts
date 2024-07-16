import { EmployerController } from './employer.controller';
import { EmployerService } from './employer.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/app/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [EmployerController],
	providers: [EmployerService],
})
export class EmployerModule {}
