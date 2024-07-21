import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { CreateExperienceDto } from '../dto/create-experience.dto';
import { ExperienceResponseType } from '../types/experience.response-type';
import { PrismaService } from 'src/app/prisma/prisma.service';

@Injectable()
export class ExperienceService {
    constructor(private prismaService: PrismaService) {}

    async findExperienceById(id: string): Promise<ExperienceResponseType> {
        if (!id) {
            throw new BadRequestException('Experience ID must be provided');
        }

        const experienceRecord = await this.prismaService.experience.findFirst({
            where: {
                id,
            },
        });

        if (experienceRecord.id !== id) {
            throw new NotFoundException(`Experience with ID '${id}' not found`);
        }

        return experienceRecord;
    }

    async newExperience(
        seekerId: string,
        createExperienceDto: CreateExperienceDto[],
    ): Promise<ExperienceResponseType[]> {
        const seeker = await this.prismaService.seeker.findUnique({
            where: { id: seekerId },
        });

        if (!seeker) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Seeker ID does not exist!',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const data = createExperienceDto.map((experience) => ({
            ...experience,
            seekerId,
        }));
        await this.prismaService.experience.createMany({
            data,
        });

        return data;
    }

    async updateExperience(id: string, updateExperienceDto: CreateExperienceDto): Promise<void> {
        if (!id) {
            throw new BadRequestException('Experience ID must be provided');
        }

        const experienceRecord = await this.prismaService.experience.findUnique({
            where: { id },
        });

        if (!experienceRecord) {
            throw new NotFoundException(`Education record with ID '${id}' not found`);
        }

        await this.prismaService.experience.update({
            data: updateExperienceDto,
            where: { id },
        });
    }

    async removeExperience(id: string): Promise<void> {
        if (!id) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Experience ID is required',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            await this.prismaService.experience.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: `Work Experience with ID ${id} not found`,
                    },
                    HttpStatus.NOT_FOUND,
                );
            } else {
                throw new HttpException(
                    {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Failed to delete Work Experience',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }
}
