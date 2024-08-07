import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { SearchJobDto } from './dto/search-job.dto';

@Injectable()
export class JobAdsService {
    constructor(private prismaService: PrismaService) {}

    // TODO: Create Promise type
    async findOrSearch(searchJobDto: SearchJobDto) {
        const { query } = searchJobDto;
        if (query) {
            return this.search(query);
        } else {
            return await this.findAll();
        }
    }

    // TODO: Create Promise type
    private search(query: string) {
        return this.prismaService.jobAds.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: query,
                        },
                    },
                ],
            },
            select: {
                id: true,
                title: true,
                description: true,
                requirements: true,
                salary: true,
                createdAt: true,
                status: true,
                employer: {
                    select: {
                        id: true,
                        accountName: true,
                        company: true,
                    },
                },
            },
        });
    }

    // TODO: Create Promise type
    private async findAll() {
        return this.prismaService.jobAds.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                requirements: true,
                salary: true,
                createdAt: true,
                status: true,
                employer: {
                    select: {
                        id: true,
                        accountName: true,
                        company: true,
                    },
                },
            },
        });
    }

    // TODO: Create Promise type
    async findOne(id: string) {
        return this.prismaService.jobAds.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                title: true,
                description: true,
                requirements: true,
                salary: true,
                createdAt: true,
                status: true,
                employer: {
                    select: {
                        id: true,
                        accountName: true,
                        company: true,
                    },
                },
            },
        });
    }
}
