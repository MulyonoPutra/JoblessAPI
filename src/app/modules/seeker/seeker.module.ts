import { ApplicationService } from './services/application.service';
import { EducationService } from './services/education.service';
import { ExperienceService } from './services/experience.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/app/prisma/prisma.module';
import { SavedJobsService } from './services/saved-jobs.service';
import { SeekerController } from './seeker.controller';
import { SeekerService } from './services/seeker.service';
import { SkillService } from './services/skill.service';

@Module({
    imports: [PrismaModule],
    controllers: [SeekerController],
    providers: [
        SeekerService,
        EducationService,
        ExperienceService,
        SavedJobsService,
        SkillService,
        ApplicationService,
    ],
})
export class SeekerModule {}
