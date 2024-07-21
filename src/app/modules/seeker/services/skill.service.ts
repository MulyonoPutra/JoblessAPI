import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateSkillDto } from '../dto/create-skill.dto';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { SkillsResponseType } from '../types/skills.response-type';

@Injectable()
export class SkillService {
    constructor(private prismaService: PrismaService) {}

    async findSkillsBySeekerId(seekerId: string): Promise<SkillsResponseType[]> {
        return this.prismaService.skill.findMany({
            where: { seekerId },
            select: {
                id: true,
                name: true,
            },
        });
    }

    async addSkillsBySeekerId(id: string, data: CreateSkillDto[]): Promise<SkillsResponseType[]> {
        if (!id) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Seeker ID is required!',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        const skills = data.map((skill) => {
            return {
                ...skill,
                seekerId: id,
            };
        });
        await this.prismaService.skill.createMany({
            data: skills,
        });

        return data;
    }

    async removeSkills(id: string): Promise<void> {
        if (!id) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Skill ID is required!',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            await this.prismaService.skill.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: `Skill with ID ${id} not found`,
                    },
                    HttpStatus.NOT_FOUND,
                );
            } else {
                throw new HttpException(
                    {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Failed to delete Skill',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }
}
