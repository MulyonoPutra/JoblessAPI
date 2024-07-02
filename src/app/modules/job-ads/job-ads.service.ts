import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/prisma/prisma.service';

@Injectable()
export class JobAdsService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.jobAds.findMany({
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
    });
  }

  async findOne(id: string) {
    return await this.prismaService.jobAds.findFirst({
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
