import * as cloudinary from 'cloudinary';

import {
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { CreateAddressDto } from './dto/create-address.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { CreateJobAdsDto } from './dto/create-job-ads.dto';
import { CreatedJobAdsType } from './types/created-job-ads.type';
import { EmployerCreatedType } from './types/employer-created.type';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { generateCustomId } from 'src/app/common/utility/generator-id';
import { educationSelection, experienceSelection, userSelection } from 'src/app/common/queries';

@Injectable()
export class EmployerService {
    constructor(private prismaService: PrismaService) {}

    async create(
        createEmployerDto: CreateEmployerDto,
        userId: string,
    ): Promise<EmployerCreatedType> {
        const existingEmployer = await this.prismaService.employer.findUnique({
            where: {
                userId: userId,
            },
        });

        if (existingEmployer) {
            throw new ConflictException('You already created employer account..');
        }

        createEmployerDto.userId = userId;
        createEmployerDto.accountNumber = generateCustomId();
        return await this.prismaService.employer.create({
            data: createEmployerDto,
        });
    }

    // TODO: Create Promise type
    async findAll() {
        return await this.prismaService.employer.findMany({
            select: {
                id: true,
                company: true,
                jobAds: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        requirements: true,
                        salary: true,
                        location: true,
                        workType: true,
                        payType: true,
                        createdAt: true,
                        applications: {
                            select: {
                                id: true,
                                date: true,
                                status: true,
                                seeker: {
                                    select: {
                                        id: true,
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

    // TODO: Create Promise type
    async findOne(id: string) {
        const employer = await this.prismaService.employer.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                accountName: true,
                accountNumber: true,
                company: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        header: true,
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
                        id: true,
                        title: true,
                        description: true,
                        requirements: true,
                        salary: true,
                        location: true,
                        workType: true,
                        payType: true,
                        createdAt: true,
                        applications: {
                            select: {
                                id: true,
                                date: true,
                                status: true,
                                seeker: {
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

        // Additional check for null jobSeeker
        employer.jobAds.forEach((jobAd) => {
            jobAd.applications.forEach((application) => {
                if (!application.seeker) {
                    throw new NotFoundException('Job Seeker is not found!');
                }
            });
        });

        return employer;
    }

    // TODO: Create Promise type
    async update(id: string, updateEmployerDto: UpdateEmployerDto) {
        return await this.prismaService.employer.update({
            data: updateEmployerDto,
            where: { id },
        });
    }

    // TODO: Create Promise type
    async removeJobAds(id: string) {
        return await this.prismaService.jobAds.delete({
            where: { id },
        });
    }

    async createJobAds(createJobAds: CreateJobAdsDto): Promise<CreatedJobAdsType> {
        return await this.prismaService.jobAds.create({
            data: createJobAds,
            select: {
                id: true,
                title: true,
                description: true,
                requirements: true,
                salary: true,
                location: true,
                workType: true,
                payType: true,
                createdAt: true,
            },
        });
    }

    // TODO: Create Promise type
    async findAllJobAds() {
        return await this.prismaService.$queryRaw`SELECT * FROM "jobads"`;
    }

    // TODO: Create Promise type
    async createCompany(createCompanyDto: CreateCompanyDto) {
        return await this.prismaService.company.create({
            data: createCompanyDto,
        });
    }

    // TODO: Create Promise type
    async createAddress(createAddressDto: CreateAddressDto) {
        return await this.prismaService.address.create({
            data: createAddressDto,
        });
    }

    // TODO: Create Promise type
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
