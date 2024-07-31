import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateSavedJobsDto } from '../dto/create-saved-jobs.dto';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { companySelector } from 'src/app/common/selectors';

@Injectable()
export class SavedJobsService {
    constructor(private prismaService: PrismaService) {}

    async removeSavedJobs(id: string): Promise<void> {
        if (!id) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Education ID is required!',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            await this.prismaService.savedJobs.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: `Education with ID ${id} not found`,
                    },
                    HttpStatus.NOT_FOUND,
                );
            } else {
                throw new HttpException(
                    {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Failed to delete Education',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    async createSavedJobs(createSavedJobsDto: CreateSavedJobsDto): Promise<void> {
        createSavedJobsDto.isBookmark = true;
        await this.prismaService.savedJobs.createMany({
            data: createSavedJobsDto,
        });
    }

    // TODO: Create Promise type
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
                        createdAt: true,
                        salary: true,
                        location: true,
                        workType: true,
                        payType: true,
                        employer: {
                            select: {
                                id: true,
                                company: companySelector(),
                            },
                        },
                    },
                },
            },
        });

        return savedJobs.map((savedJob) => ({
            id: savedJob.id,
            jobAds: savedJob.jobAds,
        }));
    }
}
