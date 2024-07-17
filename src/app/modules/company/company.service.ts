import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { SearchCompanyDto } from './dto/search-company.dto';

@Injectable()
export class CompanyService {
    constructor(private prismaService: PrismaService) {}

    // TODO: Create Promise type
    async findOrSearch(searchCompanyDto: SearchCompanyDto): Promise<any> {
        const { query } = searchCompanyDto;
        if (query) {
            return this.search(query);
        } else {
            return await this.findAll();
        }
    }

    // TODO: Create Promise type
    private findAll() {
        return this.prismaService.company.findMany({
            select: {
                id: true,
                name: true,
                header: true,
                logo: true,
                website: true,
                industry: true,
                size: true,
                location: true,
                description: true,
                benefit: true,
                contactInfo: true,
                address: true,
                employer: {
                    select: {
                        jobAds: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                requirements: true,
                                salary: true,
                            },
                        },
                    },
                },
            },
        });
    }

    // TODO: Create Promise type
    private search(query: string) {
        return this.prismaService.company.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                        },
                    },
                ],
            },
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
                address: true,
                employer: {
                    select: {
                        jobAds: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                requirements: true,
                                salary: true,
                            },
                        },
                    },
                },
            },
        });
    }

    // TODO: Create Promise type
    async findOne(id: string) {
        return await this.prismaService.company.findFirst({
            where: {
                id,
            },
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
                address: true,
                employer: {
                    select: {
                        jobAds: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                requirements: true,
                                salary: true,
                            },
                        },
                    },
                },
            },
        });
    }

    // TODO: Create Promise type
    async findJobAdsByCompanyId(id: string): Promise<any[]> {
        const company = await this.prismaService.company.findUnique({
            where: { id },
            include: {
                employer: {
                    select: {
                        jobAds: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                requirements: true,
                                salary: true,
                                createdAt: true,
                                employer: {
                                    select: {
                                        id: true,
                                        accountName: true,
                                        company: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!company) {
            throw new Error(`Company with ID ${id} not found`);
        }

        return company.employer.jobAds;
    }
}
