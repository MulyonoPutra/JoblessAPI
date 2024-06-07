import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { SeekerService } from './seeker.service';
import { CreateSeekerDto } from './dto/create-seeker.dto';
import { AuthenticationGuard } from 'src/app/common/guards/authentication.guard';
import { CurrentUserId } from 'src/app/common/decorators';
import { CreateEducationDto } from './dto/create-education.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CreateSavedJobsDto } from './dto/create-saved-jobs.dto';
import { UpdateSeekerDto } from './dto/update-seeker.dto';

@Controller('seeker')
export class SeekerController {
  constructor(private readonly seekerService: SeekerService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  create(
    @Body() createSeekerDto: CreateSeekerDto,
    @CurrentUserId() userId: string,
  ) {
    return this.seekerService.create(createSeekerDto, userId);
  }

  @Get()
  findAll() {
    return this.seekerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seekerService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seekerService.remove(id);
  }

  @Patch(':id')
  update(
    @Body() updateSeekerDto: UpdateSeekerDto,
    @Param('id') seekerId: string,
    @CurrentUserId() userId: string,
  ) {
    return this.seekerService.update(updateSeekerDto, userId, seekerId);
  }

  @UseGuards(AuthenticationGuard)
  @Post('education')
  createEducation(@Body() createEducationDto: CreateEducationDto[]) {
    return this.seekerService.newEducation(createEducationDto);
  }

  @Patch('education/:id')
  updateEducation(
    @Param('id') id: string,
    @Body() updateEducationDto: UpdateEducationDto,
  ) {
    return this.seekerService.updateEducation(id, updateEducationDto);
  }

  @Delete('education/:id')
  removeEducation(@Param('id') id: string) {
    return this.seekerService.removeEducation(id);
  }

  @Delete('experience/:id')
  removeExperience(@Param('id') id: string) {
    return this.seekerService.removeEducation(id);
  }

  @UseGuards(AuthenticationGuard)
  @Post('experience')
  createExperience(@Body() createExperienceDto: CreateExperienceDto[]) {
    return this.seekerService.newExperience(createExperienceDto);
  }

  @UseGuards(AuthenticationGuard)
  @Post('application')
  createApplication(@Body() createApplicationDto: CreateApplicationDto[]) {
    return this.seekerService.createApplication(createApplicationDto);
  }

  @UseGuards(AuthenticationGuard)
  @Post('saved-jobs')
  createSavedJobs(@Body() createSavedJobsDto: CreateSavedJobsDto[]) {
    return this.seekerService.createSavedJobs(createSavedJobsDto);
  }
}
