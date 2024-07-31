import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
} from '@nestjs/common';
import { CurrentUserId, Roles, UploadFileDecorator } from 'src/app/common/decorators';
import { AuthenticationGuard } from 'src/app/common/guards/authentication.guard';
import { AuthorizationGuard } from 'src/app/common/guards/authorization.guard';
import { Role } from '../auth/enums/role.enum';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CreateEducationDto } from './dto/create-education.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { CreateSavedJobsDto } from './dto/create-saved-jobs.dto';
import { CreateSeekerDto } from './dto/create-seeker.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { UpdateSeekerDto } from './dto/update-seeker.dto';
import { ApplicationService } from './services/application.service';
import { EducationService } from './services/education.service';
import { ExperienceService } from './services/experience.service';
import { SavedJobsService } from './services/saved-jobs.service';
import { SeekerService } from './services/seeker.service';
import { SkillService } from './services/skill.service';
import { EducationResponseType } from './types/education-response.type';
import { ExperienceResponseType } from './types/experience.response-type';
import { SkillsResponseType } from './types/skills.response-type';
import { CreateApplicationResponseType } from './types/create-application.response-type';

@Controller('seeker')
export class SeekerController {
    constructor(
        private readonly seekerService: SeekerService,
        private readonly educationService: EducationService,
        private readonly experienceService: ExperienceService,
        private readonly savedJobsService: SavedJobsService,
        private readonly skillService: SkillService,
        private readonly applicationService: ApplicationService,
    ) {}

    // TODO: Create Promise type
    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Post()
    create(
        @Body() createSeekerDto: CreateSeekerDto,
        @CurrentUserId() userId: string,
    ): Promise<{ summary: string }> {
        return this.seekerService.create(createSeekerDto, userId);
    }

    // TODO: Create Promise type
    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Get()
    findAll() {
        return this.seekerService.findAll();
    }

    // TODO: Create Promise type
    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.seekerService.findOne(id);
    }

    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.seekerService.remove(id);
    }

    // TODO: Create Promise type
    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Patch(':id')
    update(
        @Body() updateSeekerDto: UpdateSeekerDto,
        @Param('id') seekerId: string,
        @CurrentUserId() userId: string,
    ) {
        return this.seekerService.update(updateSeekerDto, userId, seekerId);
    }

    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Post('education/:seekerId')
    createEducation(
        @Param('seekerId') seekerId: string,
        @Body() createEducationDto: CreateEducationDto[],
    ): Promise<EducationResponseType[]> {
        return this.educationService.newEducation(seekerId, createEducationDto);
    }

    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Patch('education/:id')
    updateEducation(
        @Param('id') id: string,
        @Body() updateEducationDto: UpdateEducationDto,
    ): Promise<void> {
        return this.educationService.updateEducation(id, updateEducationDto);
    }

    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Get('education/:id')
    findEducationById(@Param('id') id: string): Promise<EducationResponseType> {
        return this.educationService.findEducationById(id);
    }

    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Delete('education/:id')
    removeEducation(@Param('id') id: string): Promise<void> {
        return this.educationService.removeEducation(id);
    }

    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Delete('experience/:id')
    removeExperience(@Param('id') id: string): Promise<void> {
        return this.experienceService.removeExperience(id);
    }

    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Post('experience/:seekerId')
    createExperience(
        @Param('seekerId') seekerId: string,
        @Body() createExperienceDto: CreateExperienceDto[],
    ): Promise<ExperienceResponseType[]> {
        return this.experienceService.newExperience(seekerId, createExperienceDto);
    }

    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Patch('experience/:id')
    updateExperience(
        @Param('id') id: string,
        @Body() updateExperienceDto: CreateExperienceDto,
    ): Promise<void> {
        return this.experienceService.updateExperience(id, updateExperienceDto);
    }

    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Get('experience/:id')
    findExperienceById(@Param('id') id: string): Promise<ExperienceResponseType> {
        return this.experienceService.findExperienceById(id);
    }

    // TODO: Create Promise type
    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Post('application')
    createApplication(
        @Body() createApplicationDto: CreateApplicationDto,
    ): Promise<CreateApplicationResponseType> {
        return this.applicationService.createApplication(createApplicationDto);
    }

    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Post('saved-jobs')
    createSavedJobs(@Body() createSavedJobsDto: CreateSavedJobsDto): Promise<void> {
        return this.savedJobsService.createSavedJobs(createSavedJobsDto);
    }

    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Post('skills/:id')
    newSkills(
        @Param('id') id: string,
        @Body() createSkillsDto: CreateSkillDto[],
    ): Promise<SkillsResponseType[]> {
        return this.skillService.addSkillsBySeekerId(id, createSkillsDto);
    }

    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Delete('skills/:id')
    removeSkills(@Param('id') id: string): Promise<void> {
        return this.skillService.removeSkills(id);
    }

    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Get('skills/:id')
    findSkills(@Param('id') id: string): Promise<SkillsResponseType[]> {
        return this.skillService.findSkillsBySeekerId(id);
    }

    // TODO: Create Promise type
    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Get('saved-jobs/:id')
    findAllSavedJobs(@Param('id') id: string) {
        return this.savedJobsService.findSavedJobsBySeekerId(id);
    }

    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Delete('saved-jobs/:id')
    removeSavedJobs(@Param('id') id: string): Promise<void> {
        return this.savedJobsService.removeSavedJobs(id);
    }

    // TODO: Create Promise type
    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Get('application/:id')
    findAllApplication(@Param('id') id: string) {
        return this.applicationService.findApplicationBySeekerId(id);
    }

    // TODO: Create Promise type
    @Roles(Role.SEEKER)
    @HttpCode(HttpStatus.OK)
    @Post('upload')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @UploadFileDecorator()
    uploadResume(@CurrentUserId() userId: string, @UploadedFile() file: Express.Multer.File) {
        return this.seekerService.uploadResume(userId, file);
    }
}
