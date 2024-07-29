import * as cloudinary from 'cloudinary';

import {
    BadRequestException,
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { educationSelector, experienceSelector } from 'src/app/common/selectors';

import { CompanyResponseType } from './types/company.response-type';
import { CreateAddressDto } from './dto/create-address.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { CreateJobAdsDto } from './dto/create-job-ads.dto';
import { CreatedJobAdsType } from './types/created-job-ads.type';
import { EmployerCreatedType } from './types/employer-created.type';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { UpdateJobAdStatusDto } from './dto/update-job-ads.dto';
import { generateCustomId } from 'src/app/common/utility/generator-id';

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
        return this.prismaService.employer.create({
            data: createEmployerDto,
        });
    }

    // TODO: Create Promise type
    async findAll() {
        return this.prismaService.employer.findMany({
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
                        application: {
                            select: {
                                id: true,
                                date: true,
                                status: true,
                                seeker: {
                                    select: {
                                        id: true,
                                        summary: true,
                                        user: {
                                            select: {
                                                id: true,
                                                name: true,
                                                email: true,
                                                avatar: true,
                                                phone: true,
                                                birthday: true,
                                                gender: true,
                                            },
                                        },
                                        education: educationSelector(),
                                        experience: experienceSelector(),
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
                        birthday: true,
                        gender: true,
                    },
                },
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
                        status: true,
                        application: {
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
            jobAd.application.forEach((application) => {
                if (!application.seeker) {
                    throw new NotFoundException('Job Seeker is not found!');
                }
            });
        });

        return employer;
    }

    async update(id: string, updateEmployerDto: UpdateEmployerDto): Promise<void> {
        if (!id) {
            throw new BadRequestException('Employer ID must be provided');
        }

        const employerRecord = await this.prismaService.employer.findUnique({
            where: { id },
        });

        if (!employerRecord) {
            throw new NotFoundException(`Employer record with ID '${id}' not found`);
        }

        updateEmployerDto.accountNumber = generateCustomId();
        await this.prismaService.employer.update({
            data: updateEmployerDto,
            where: { id },
        });
    }

    async removeJobAds(id: string): Promise<void> {
        if (!id) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Job Ads ID is required!',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            await this.prismaService.jobAds.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: `Job Ads with ID ${id} not found`,
                    },
                    HttpStatus.NOT_FOUND,
                );
            } else {
                throw new HttpException(
                    {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Failed to delete Job Ads',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    async createJobAds(
        employerId: string,
        createJobAds: CreateJobAdsDto,
    ): Promise<CreatedJobAdsType> {
        createJobAds.employerId = employerId;
        return this.prismaService.jobAds.create({
            data: {
                ...createJobAds,
                status: 'open'
            },
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
                updatedAt: true,
                status: true
            },
        });
    }

    async updateJobAdStatus(jobAdId: string, updateJobAdStatusDto: UpdateJobAdStatusDto) {
        return this.prismaService.jobAds.update({
            where: { id: jobAdId },
            data: {
                status: updateJobAdStatusDto.status,
            },
        });
    }

    async findJobAdsByStatus(employerId: string, status: string) {
        return this.prismaService.jobAds.findMany({
            where: {
                id: employerId,
                status: status
            },
            select: {
                id: true,
                title: true,
                description: true,
                requirements: true,
                salary: true,
                location: true,
                workType: true,
                payType: true,
                status: true,
                employer: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    // TODO: Create Promise type
    async findAllJobAds() {
        return this.prismaService.$queryRaw`SELECT * FROM "jobads"`;
    }

    async createCompany(
        id: string,
        createCompanyDto: CreateCompanyDto,
    ): Promise<CompanyResponseType> {
        if (!id) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Employer ID is required!',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        createCompanyDto.employerId = id;
        return this.prismaService.company.create({
            data: createCompanyDto,
        });
    }

    // TODO: Create Promise type
    async createAddress(id: string, createAddressDto: CreateAddressDto) {
        if (!id) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Company ID is required!',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        createAddressDto.companyId = id;
        return this.prismaService.address.create({
            data: createAddressDto,
        });
    }

    // TODO: Create Promise type
    async uploadLogo(id: string, file: Express.Multer.File) {
        if (!id) {
            throw new HttpException('Company ID is required', HttpStatus.BAD_REQUEST);
        }
        
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

    async uploadHeader(id: string, file: Express.Multer.File) {
        if (!id) {
            throw new HttpException('Company ID is required', HttpStatus.BAD_REQUEST);
        }
        const result = await cloudinary.v2.uploader.upload(file.path, {
            folder: 'nest/header',
        });
        const header = result.secure_url;

        const company = await this.prismaService.company.findFirst({
            where: { id },
        });

        if (company) {
            const updated = await this.prismaService.company.update({
                data: { header },
                where: { id },
            });

            if (updated) {
                return {
                    statusCode: 200,
                    message: 'Header uploaded successfully!',
                };
            }
        }

        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

}
