import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateApplicationDto } from '../dto/create-application.dto';
import { CreateApplicationResponseType } from '../types/create-application.response-type';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { companySelector } from 'src/app/common/selectors';

@Injectable()
export class ApplicationService {
    constructor(private prismaService: PrismaService) {}

    async createApplication(createApplicationDto: CreateApplicationDto): Promise<CreateApplicationResponseType> {
        // Check if the job ad exists
        await this.onCheckJobAdsId(createApplicationDto);

        // Check for existing application
        await this.onCheckExistingApp(createApplicationDto);

        return this.prismaService.application.create({
            data: createApplicationDto,
        });
    }

    // TODO: Create Promise type
    async findApplicationBySeekerId(seekerId: string) {
        return this.prismaService.application.findMany({
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
                                company: companySelector(),
                            },
                        },
                        createdAt: true,
                    },
                },
            },
        });
    }

    private async onCheckJobAdsId(createApplicationDto: CreateApplicationDto) {
        const jobAd = await this.prismaService.jobAds.findUnique({
            where: {
                id: createApplicationDto.jobAdsId,
            },
        });

        if (!jobAd) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Job Advertisement ID is not found!',
                },
                HttpStatus.NOT_FOUND,
            );
        }
    }

    private async onCheckExistingApp(createApplicationDto: CreateApplicationDto) {
        const existingApplication = await this.prismaService.application.findFirst({
            where: {
                jobAdsId: createApplicationDto.jobAdsId,
                seekerId: createApplicationDto.seekerId,
            },
        });

        if (existingApplication) {
            throw new HttpException(
                {
                    status: HttpStatus.CONFLICT,
                    error: 'You already applied to this application..',
                },
                HttpStatus.CONFLICT,
            );
        }
    }
}
