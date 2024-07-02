import * as cloudinary from 'cloudinary';

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  educationSelection,
  experienceSelection,
  userSelection,
} from 'src/app/common/queries';

import { CreateAddressDto } from './dto/create-address.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { CreateJobAdsDto } from './dto/create-job-ads.dto';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { UpdateEmployerDto } from './dto/update-employer.dto';

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
        company: true,
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
                    user: userSelection(),
                    education: educationSelection(),
                    experience: experienceSelection(),
                  },
                },
              },
            },
          },
        },
        user: userSelection(),
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
        accountName: true,
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            website: true,
            industry: true,
            size: true,
            location: true,
            description: true,
            benefit: true,
            contactInfo: true,
            address: {
              select: {
                id: true,
                street: true,
                province: true,
                regency: true,
                district: true,
                village: true,
                postCode: true,
              },
            },
          },
        },
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

  async update(id: string, updateEmployerDto: UpdateEmployerDto) {
    return await this.prismaService.employer.update({
      data: updateEmployerDto,
      where: { id },
    });
  }

  async removeJobAds(id: string) {
    return await this.prismaService.jobAds.delete({
      where: { id },
    });
  }

  async createJobAds(createEducationDto: CreateJobAdsDto[]) {
    return await this.prismaService.jobAds.createMany({
      data: createEducationDto,
    });
  }

  async findAllJobAds() {
    return await this.prismaService.$queryRaw`SELECT * FROM "jobads"`;
  }

  async createCompany(createCompanyDto: CreateCompanyDto) {
    return await this.prismaService.company.create({
      data: createCompanyDto,
    });
  }

  async createAddress(createAddressDto: CreateAddressDto) {
    return await this.prismaService.address.create({
      data: createAddressDto,
    });
  }

  async uploadLogo(id: string, file: Express.Multer.File) {
    const result = await cloudinary.v2.uploader.upload(file.path, {
      folder: 'nest',
    });
    const logo = result.secure_url;
    const company = await this.prismaService.company.findFirst({
      where: {
        id,
      },
    });

    if (company) {
      const updated = await this.prismaService.company.update({
        data: {
          logo,
        },
        where: {
          id,
        },
      });

      if (updated) {
        return {
          statusCode: 200,
          message: 'logo Uploaded!',
        };
      }
    }

    throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
  }
}
