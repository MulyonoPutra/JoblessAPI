import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { CreateEducationDto } from '../dto/create-education.dto';
import { EducationResponseType } from '../types/education-response.type';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { UpdateEducationDto } from '../dto/update-education.dto';

@Injectable()
export class EducationService {
    constructor(private prismaService: PrismaService) {}

    async newEducation(
        seekerId: string,
        createEducationDto: CreateEducationDto[],
    ): Promise<EducationResponseType[]> {
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

        const data = createEducationDto.map((education) => ({
            ...education,
            seekerId,
        }));
        await this.prismaService.education.createMany({
            data,
        });

        return data;
    }

    async updateEducation(id: string, updateEducationDto: UpdateEducationDto): Promise<void> {
        if (!id) {
            throw new BadRequestException('Education ID must be provided');
        }

        const educationRecord = await this.prismaService.education.findUnique({
            where: { id },
        });

        if (!educationRecord) {
            throw new NotFoundException(`Education record with ID '${id}' not found`);
        }

        await this.prismaService.education.update({
            data: updateEducationDto,
            where: { id },
        });
    }

    async findEducationById(id: string): Promise<EducationResponseType> {
        return this.prismaService.education.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                startDate: true,
                endDate: true,
                title: true,
                institution: true,
                description: true,
                GPA: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async removeEducation(id: string): Promise<void> {
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
            await this.prismaService.education.delete({
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
}
