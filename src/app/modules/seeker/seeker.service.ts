import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { applicationSelector, educationSelector, experienceSelector, skillSelector } from 'src/app/common/selectors';

import { CreateApplicationDto } from './dto/create-application.dto';
import { CreateEducationDto } from './dto/create-education.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { CreateSavedJobsDto } from './dto/create-saved-jobs.dto';
import { CreateSeekerDto } from './dto/create-seeker.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { EducationResponseType } from './types/education-response.type';
import { ExperienceEntity } from './entities/experience.entity';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { SeekerEntity } from './entities/seeker.entity';
import { UpdateEducationDto } from './dto/update-education.dto';
import { UpdateSeekerDto } from './dto/update-seeker.dto';
import { savedJobAdsSelector } from 'src/app/common/selectors/saved-jobs.selector';
import { userSelector } from 'src/app/common/selectors/user.selector';

@Injectable()
export class SeekerService {
    constructor(private prismaService: PrismaService) {}

    // TODO: Create Promise type
    async create(data: CreateSeekerDto, userId: string): Promise<any> {
        data.userId = userId;
        await this.prismaService.seeker.create({
            data: data,
        });

        const { summary } = data;

        return {
            summary
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
                Application: applicationSelector()
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
                Application: applicationSelector()
            },
        });

        if (seeker.id !== id) {
            throw new NotFoundException(`Seeker with ID '${id}' not found`);
        }

        return seeker;
    }

    // TODO: Create Promise type
    async remove(id: string) {
        if (!id) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Seeker ID is required',
            }, HttpStatus.BAD_REQUEST);
        }

        try {
            await this.prismaService.seeker.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: `Seeker with ID ${id} not found`,
                }, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Failed to delete Seeker',
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

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

    async findExperienceById(id: string): Promise<ExperienceEntity> {
        if (!id) {
            throw new BadRequestException('Experience ID must be provided');
        }

        const experienceRecord = await this.prismaService.experience.findFirst({
            where: {
                id,
            },
        });

        if(experienceRecord.id !== id){
            throw new NotFoundException(`Experience with ID '${id}' not found`);
        }

        return experienceRecord;
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

    // TODO: Create Promise type
    async removeEducation(id: string) {
        return this.prismaService.education.delete({
            where: { id },
        });
    }

    // TODO: Create Promise type
    async newExperience(createExperienceDto: CreateExperienceDto[]) {
        return this.prismaService.experience.createMany({
            data: createExperienceDto,
        });
    }

    // TODO: Create Promise type
    async updateExperience(
        id: string,
        updateExperienceDto: CreateExperienceDto,
    ): Promise<ExperienceEntity> {
        return this.prismaService.experience.update({
            data: updateExperienceDto,
            where: { id },
        });
    }

    // TODO: Create Promise type
    async removeExperience(id: string) {
        return this.prismaService.experience.delete({
            where: { id },
        });
    }

    // TODO: Create Promise type
    async removeSavedJobs(id: string) {
        return this.prismaService.savedJobs.delete({
            where: { id },
        });
    }

    // TODO: Create Promise type
    async createApplication(createApplicationDto: CreateApplicationDto) {
        // Check if the job ad exists
        await this.onCheckJobAdsId(createApplicationDto);

        // Check for existing application
        await this.onCheckExistingApp(createApplicationDto);

        return this.prismaService.application.create({
            data: createApplicationDto,
        });
    }

    // TODO: Create Promise type
    async createSavedJobs(createSavedJobsDto: CreateSavedJobsDto[]) {
        return this.prismaService.savedJobs.createMany({
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
                        salary: true,
                        employer: {
                            select: {
                                company: true,
                            },
                        },
                        createdAt: true,
                    },
                },
            },
        });

        return savedJobs.map((savedJob) => ({
            id: savedJob.id,
            jobAds: savedJob.jobAds,
        }));
    }

    // TODO: Create Promise type
    async findSkillsBySeekerId(seekerId: string) {
        return this.prismaService.skill.findMany({
            where: { seekerId },
            select: {
                id: true,
                name: true,
            },
        });
    }

    async createNewSkills(id: string, data: CreateSkillDto[]): Promise<CreateSkillDto[]> {
        const skills = data.map((skill) => {
            return {
                ...skill,
                seekerId: id,
            };
        });
        const createdSkills = await this.prismaService.skill.createMany({
            data: skills,
        });

        return createdSkills as unknown as CreateSkillDto[];
    }

    async removeSkills(id: string): Promise<CreateSkillDto> {
        return this.prismaService.skill.delete({
            where: { id },
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
                                company: true,
                            },
                        },
                        createdAt: true,
                    },
                },
            },
        });
    }

    // TODO: Create Promise type
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

    // TODO: Create Promise type
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
