import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateEmployerDto } from './dto/create-employer.dto';
import { CreateJobAdsDto } from './dto/create-job-ads.dto';
import { PrismaService } from 'src/app/prisma/prisma.service';

@Injectable()
export class EmployerService {
  constructor(private prismaService: PrismaService) {}

  async create(createSeekerDto: CreateEmployerDto, userId: string) {
    createSeekerDto.userId = userId;
    return await this.prismaService.employer.create({
      data: createSeekerDto,
    });
  }

  async findAll() {
    return await this.prismaService.employer.findMany({
      select: {
        id: true,
        companyName: true,
        industry: true,
        contactInfo: true,
        jobAds: {
          select: {
            title: true,
            description: true,
            requirements: true,
            salary: true,
            applications: {
              select: {
                id: true,
                date: true,
                status: true,
                jobSeeker: {
                  select: {
                    id: true,
                    birthday: true,
                    summary: true,
                    user: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                        phone: true,
                        role: true,
                      },
                    },
                    experience: true,
                    education: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            role: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const employer = await this.prismaService.employer.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        companyName: true,
        industry: true,
        contactInfo: true,
        jobAds: {
          select: {
            title: true,
            description: true,
            requirements: true,
            salary: true,
            applications: {
              select: {
                id: true,
                date: true,
                status: true,
                jobSeeker: {
                  select: {
                    id: true,
                    user: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                        phone: true,
                        role: true,
                      },
                    },
                    birthday: true,
                    summary: true,
                    education: true,
                    experience: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    if (!employer) {
      throw new NotFoundException('Employer is not found!');
    }

    return employer;
  }

  remove(id: number) {
    return `This action removes a #${id} employer`;
  }

  async createJobAds(createEducationDto: CreateJobAdsDto[]) {
    return await this.prismaService.jobAds.createMany({
      data: createEducationDto,
    });
  }
}
