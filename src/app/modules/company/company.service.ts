import { Company } from './entities/company.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<Company[]> {
    return await this.prismaService.company.findMany({
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

  async findOne(id: string): Promise<Company> {
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
