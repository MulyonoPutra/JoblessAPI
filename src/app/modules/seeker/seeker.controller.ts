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
  UseGuards,
} from '@nestjs/common';
import { CurrentUserId, Roles } from 'src/app/common/decorators';
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
import { SeekerService } from './seeker.service';
import { ExperienceEntity } from './entities/experience.entity';
import { EducationEntity } from './entities/education.entity';

@Controller('seeker')
export class SeekerController {
  constructor(private readonly seekerService: SeekerService) {}

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post()
  create(
    @Body() createSeekerDto: CreateSeekerDto,
    @CurrentUserId() userId: string,
  ) {
    return this.seekerService.create(createSeekerDto, userId);
  }

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get()
  findAll() {
    return this.seekerService.findAll();
  }

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
  remove(@Param('id') id: string) {
    return this.seekerService.remove(id);
  }

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
  @Post('education')
  createEducation(@Body() createEducationDto: CreateEducationDto[]) {
    return this.seekerService.newEducation(createEducationDto);
  }

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch('education/:id')
  updateEducation(
    @Param('id') id: string,
    @Body() updateEducationDto: UpdateEducationDto,
  ) {
    return this.seekerService.updateEducation(id, updateEducationDto);
  }

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('education/:id')
  findEducationById(@Param('id') id: string): Promise<EducationEntity> {
    return this.seekerService.findEducationById(id);
  }

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Delete('education/:id')
  removeEducation(@Param('id') id: string) {
    return this.seekerService.removeEducation(id);
  }

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Delete('experience/:id')
  removeExperience(@Param('id') id: string) {
    return this.seekerService.removeExperience(id);
  }

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post('experience')
  createExperience(@Body() createExperienceDto: CreateExperienceDto[]) {
    return this.seekerService.newExperience(createExperienceDto);
  }

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch('experience/:id')
  updateExperience(
    @Param('id') id: string,
    @Body() updateExperienceDto: CreateExperienceDto,
  ): Promise<ExperienceEntity> {
    return this.seekerService.updateExperience(id, updateExperienceDto);
  }

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('experience/:id')
  findExperienceById(@Param('id') id: string): Promise<ExperienceEntity> {
    return this.seekerService.findExperienceById(id);
  }

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post('application')
  createApplication(@Body() createApplicationDto: CreateApplicationDto[]) {
    return this.seekerService.createApplication(createApplicationDto);
  }

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post('saved-jobs')
  createSavedJobs(@Body() createSavedJobsDto: CreateSavedJobsDto[]) {
    return this.seekerService.createSavedJobs(createSavedJobsDto);
  }

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post('skills/:id')
  newSkills(
    @Param('id') id: string,
    @Body() createSkillsDto: CreateSkillDto[],
  ): Promise<CreateSkillDto[]> {
    return this.seekerService.createNewSkills(id, createSkillsDto);
  }

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Delete('skills/:id')
  removeSkills(@Param('id') id: string): Promise<CreateSkillDto> {
    return this.seekerService.removeSkills(id);
  }

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('skills/:id')
  findSkills(@Param('id') id: string) {
    return this.seekerService.findSkillsBySeekerId(id);
  }

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('saved-jobs/:id')
  findAllSavedJobs(@Param('id') id: string) {
    return this.seekerService.findSavedJobsBySeekerId(id);
  }

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Delete('saved-jobs/:id')
  removeSavedJobs(@Param('id') id: string) {
    return this.seekerService.removeSavedJobs(id);
  }

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('application/:id')
  findAllApplication(@Param('id') id: string) {
    return this.seekerService.findApplicationBySeekerId(id);
  }
}
