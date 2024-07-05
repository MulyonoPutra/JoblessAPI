import { Injectable, NotFoundException } from '@nestjs/common';
import {
  educationSelection,
  experienceSelection,
  userSelection,
} from 'src/app/common/queries';

import { CreateApplicationDto } from './dto/create-application.dto';
import { CreateEducationDto } from './dto/create-education.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { CreateSavedJobsDto } from './dto/create-saved-jobs.dto';
import { CreateSeekerDto } from './dto/create-seeker.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { ExperienceEntity } from './entities/experience.entity';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { SeekerEntity } from './entities/seeker.entity';
import { UpdateEducationDto } from './dto/update-education.dto';
import { UpdateSeekerDto } from './dto/update-seeker.dto';

@Injectable()
export class SeekerService {
  constructor(private prismaService: PrismaService) {}

  async create(createSeekerDto: CreateSeekerDto, userId: string) {
    createSeekerDto.userId = userId;
    return await this.prismaService.seeker.create({
      data: createSeekerDto,
    });
  }

  async update(
    updateSeekerDto: UpdateSeekerDto,
    userId: string,
    seekerId: string,
  ): Promise<SeekerEntity> {
    updateSeekerDto.userId = userId;
    return await this.prismaService.seeker.update({
      data: updateSeekerDto,
      where: { id: seekerId },
      select: {
        id: true,
        user: userSelection(),
        birthday: true,
        summary: true,
      },
    });
  }

  async findAll() {
    return await this.prismaService.seeker.findMany({
      select: {
        id: true,
        birthday: true,
        summary: true,
        education: educationSelection(),
        experience: experienceSelection(),
        user: userSelection(),
        skills: {
          select: {
            id: true,
            name: true,
          },
        },
        savedJobs: {
          select: {
            id: true,
            jobAds: {
              select: {
                id: true,
                title: true,
                description: true,
                requirements: true,
                salary: true,
                employer: true,
              },
            },
          },
        },
        Application: {
          select: {
            jobAds: {
              select: {
                id: true,
                title: true,
                description: true,
                requirements: true,
                salary: true,
                employer: {
                  select: {
                    id: true,
                    accountName: true,
                    company: true,
                  },
                },
                createdAt: true,
              },
            },
            id: true,
            status: true,
            date: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const seeker = await this.prismaService.seeker.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        birthday: true,
        summary: true,
        education: true,
        experience: true,
        skills: {
          select: {
            id: true,
            name: true,
          },
        },
        user: userSelection(),
        savedJobs: {
          select: {
            id: true,
            jobAds: {
              select: {
                id: true,
                title: true,
                description: true,
                requirements: true,
                salary: true,
                employer: {
                  select: {
                    id: true,
                    accountName: true,
                    company: true,
                  },
                },
                createdAt: true,
              },
            },
          },
        },
        Application: {
          select: {
            jobAds: {
              select: {
                id: true,
                title: true,
                description: true,
                requirements: true,
                salary: true,
                employer: {
                  select: {
                    id: true,
                    accountName: true,
                    company: true,
                  },
                },
              },
            },
            id: true,
            status: true,
            date: true,
          },
        },
      },
    });

    if (!seeker) {
      throw new NotFoundException('Seeker is not found!');
    }

    return seeker;
  }

  async remove(id: string) {
    return await this.prismaService.seeker.delete({
      where: { id },
    });
  }

  async newEducation(createEducationDto: CreateEducationDto[]) {
    return await this.prismaService.education.createMany({
      data: createEducationDto,
    });
  }

  async updateEducation(id: string, updateEducationDto: UpdateEducationDto) {
    return await this.prismaService.education.update({
      data: updateEducationDto,
      where: { id },
    });
  }

  async findExperienceById(id: string): Promise<ExperienceEntity> {
    return await this.prismaService.experience.findFirst({
      where: {
        id,
      },
    });
  }

  async removeEducation(id: string) {
    return await this.prismaService.education.delete({
      where: { id },
    });
  }

  async newSkills(data: CreateSkillDto[]): Promise<CreateSkillDto[]> {
    await this.prismaService.skill.createMany({
      data,
    });

    return data;
  }

  async newExperience(createExperienceDto: CreateExperienceDto[]) {
    return await this.prismaService.experience.createMany({
      data: createExperienceDto,
    });
  }

  async updateExperience(
    id: string,
    updateExperienceDto: CreateExperienceDto,
  ): Promise<ExperienceEntity> {
    return await this.prismaService.experience.update({
      data: updateExperienceDto,
      where: { id },
    });
  }

  async removeExperience(id: string) {
    return await this.prismaService.experience.delete({
      where: { id },
    });
  }

  async removeSavedJobs(id: string) {
    return await this.prismaService.savedJobs.delete({
      where: { id },
    });
  }

  async createApplication(createApplicationDto: CreateApplicationDto[]) {
    return await this.prismaService.application.createMany({
      data: createApplicationDto,
    });
  }

  async createSavedJobs(createSavedJobsDto: CreateSavedJobsDto[]) {
    return await this.prismaService.savedJobs.createMany({
      data: createSavedJobsDto,
    });
  }

  async findSavedJobsBySeekerId(seekerId: string) {
    const savedJobs = await this.prismaService.savedJobs.findMany({
      where: { seekerId },
      include: {
        jobAds: {
          select: {
            id: true,
            title: true,
            description: true,
            requirements: true,
            salary: true,
            employer: {
              select: {
                company: true,
              },
            },
            createdAt: true,
          },
        },
      },
    });

    return savedJobs.map((savedJob) => ({
      id: savedJob.id,
      jobAds: savedJob.jobAds,
    }));
  }

  async findApplicationBySeekerId(seekerId: string) {
    const applications = await this.prismaService.application.findMany({
      where: { seekerId },
      include: {
        jobAds: {
          select: {
            id: true,
            title: true,
            description: true,
            requirements: true,
            salary: true,
            employer: {
              select: {
                company: true,
              },
            },
            createdAt: true,
          },
        },
      },
    });

    return applications;
  }
}
