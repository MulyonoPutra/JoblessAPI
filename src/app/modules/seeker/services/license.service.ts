import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateLicenseDto } from '../dto/create-license.dto';

@Injectable()
export class LicenseService {
    constructor(private prismaService: PrismaService) {}

    async findAll(){
        return this.prismaService.license.findMany({})
    }

    async createLicense(seekerId: string, licenseDto: CreateLicenseDto[]) {
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

        const data = licenseDto.map((license: CreateLicenseDto) => ({
            ...license,
            seekerId,
        }));

        await this.prismaService.license.createMany({
            data,
        });

        return data;
    }

    async findLicenseById(id: string) {
        if (!id) {
            throw new BadRequestException('License ID must be provided');
        }

        const license = await this.prismaService.license.findFirst({
            where: {
                id,
            },
        });

        if (license.id !== id) {
            throw new NotFoundException(`License with ID '${id}' not found`);
        }

        return license;
    }

    async removeLicense(id: string): Promise<void> {
        if (!id) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'License ID is required!',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            await this.prismaService.license.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: `License with ID ${id} not found`,
                    },
                    HttpStatus.NOT_FOUND,
                );
            } else {
                throw new HttpException(
                    {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Failed to delete license!',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }
}