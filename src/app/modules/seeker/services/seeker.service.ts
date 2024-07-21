import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import {
    applicationSelector,
    educationSelector,
    experienceSelector,
    skillSelector,
} from 'src/app/common/selectors';

import { CreateSeekerDto } from '../dto/create-seeker.dto';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { SeekerEntity } from '../entities/seeker.entity';
import { UpdateSeekerDto } from '../dto/update-seeker.dto';
import { savedJobAdsSelector } from 'src/app/common/selectors/saved-jobs.selector';
import { userSelector } from 'src/app/common/selectors/user.selector';

@Injectable()
export class SeekerService {
    constructor(private prismaService: PrismaService) {}

    // TODO: Unused function
    async create(data: CreateSeekerDto, userId: string): Promise<{ summary: string }> {
        data.userId = userId;

        await this.prismaService.seeker.create({
            data: data,
        });

        const { summary } = data;

        return {
            summary,
        };
    }

    async update(
        updateSeekerDto: UpdateSeekerDto,
        userId: string,
        seekerId: string,
    ): Promise<SeekerEntity> {
        updateSeekerDto.userId = userId;
        return this.prismaService.seeker.update({
            data: updateSeekerDto,
            where: { id: seekerId },
            select: {
                id: true,
                user: true,
                summary: true,
            },
        });
    }

    // TODO: Create Promise type
    async findAll() {
        return this.prismaService.seeker.findMany({
            select: {
                id: true,
                summary: true,
                resume: true,
                coverLetter: true,
                links: true,
                desireSalary: true,
                startDate: true,
                license: true,
                education: educationSelector(),
                experience: experienceSelector(),
                user: userSelector(),
                skills: skillSelector(),
                savedJobs: savedJobAdsSelector(),
                application: applicationSelector(),
            },
        });
    }

    // TODO: Create Promise type
    async findOne(id: string) {
        if (!id) {
            throw new BadRequestException('Seeker ID must be provided');
        }
        const seeker = await this.prismaService.seeker.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                summary: true,
                resume: true,
                coverLetter: true,
                links: true,
                desireSalary: true,
                startDate: true,
                license: true,
                education: educationSelector(),
                experience: experienceSelector(),
                skills: skillSelector(),
                user: userSelector(),
                savedJobs: savedJobAdsSelector(),
                application: applicationSelector(),
            },
        });

        if (seeker.id !== id) {
            throw new NotFoundException(`Seeker with ID '${id}' not found`);
        }

        return seeker;
    }

    async remove(id: string): Promise<void> {
        if (!id) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Seeker ID is required',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            await this.prismaService.seeker.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: `Seeker with ID ${id} not found`,
                    },
                    HttpStatus.NOT_FOUND,
                );
            } else {
                throw new HttpException(
                    {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Failed to delete Seeker',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    // TODO: Create Promise type
    async uploadResume(userId: string, file: Express.Multer.File) {
        const filePath = `/uploads/${file.filename}`;
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                seeker: true,
            },
        });

        if (user.seeker == null) {
            throw new UnauthorizedException(
                'Seeker ID is not found! Please complete your profile first!',
            );
        }

        return this.prismaService.seeker.update({
            where: {
                id: user.seeker.id,
            },
            data: {
                resume: filePath,
            },
        });
    }
}
