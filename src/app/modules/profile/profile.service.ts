import * as cloudinary from 'cloudinary';

import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { ChangePasswordResponseType } from './types/change-password-response.type';
import { HttpCreated } from '../../common/domain/http-created';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { ProfileResponseType } from './types/profile-response.type';
import { ResponseMessage } from '../../common/constants/response-message';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateProfileResponseType } from './types/update-profile-response.type';

@Injectable()
export class ProfileService {
    constructor(private prismaService: PrismaService) {}

    async uploadAvatar(id: string, file: Express.Multer.File): Promise<HttpCreated> {
        const result: cloudinary.UploadApiResponse = await cloudinary.v2.uploader.upload(
            file.path,
            {
                folder: 'nest',
            },
        );
        const avatar = result.secure_url;
        const user = await this.prismaService.user.findFirst({
            where: {
                id,
            },
        });

        if (user) {
            const updated = await this.prismaService.user.update({
                data: {
                    avatar,
                },
                where: {
                    id,
                },
            });

            if (updated) {
                return {
                    status: HttpStatus.OK,
                    message: ResponseMessage.AVATAR_UPLOADED,
                };
            }
        }

        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    async findAll(): Promise<ProfileResponseType[]> {
        return this.prismaService.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                phone: true,
                role: true,
                createdAt: true,
                seeker: {
                    select: {
                        id: true,
                        summary: true,
                        resume: true,
                        coverLetter: true,
                        desireSalary: true,
                        startDate: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
    }

    async findOne(id: string): Promise<ProfileResponseType> {
        return this.prismaService.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                phone: true,
                role: true,
                createdAt: true,
                seeker: {
                    select: {
                        id: true,
                        summary: true,
                        resume: true,
                        coverLetter: true,
                        desireSalary: true,
                        startDate: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
    }

    async update(id: string, data: UpdateProfileDto): Promise<UpdateProfileResponseType> {
        return this.prismaService.user.update({
            data,
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                phone: true,
                birthday: true,
            },
        });
    }

    async remove(id: string) {
        return this.prismaService.user.delete({
            where: { id },
        });
    }

    async changePassword(
        id: string,
        payload: ChangePasswordDto,
    ): Promise<ChangePasswordResponseType> {
        const { newPassword, currentPassword } = payload;
        const data = await this.prismaService.user.findUnique({
            where: {
                id,
            },
            select: {
                password: true,
            },
        });

        const isCurrentPasswordValid: boolean = await compare(currentPassword, data.password);

        if (!isCurrentPasswordValid) {
            throw new UnauthorizedException('That is not your password! Please correct again.');
        }

        const hashedPassword = await hash(newPassword, 12);

        await this.prismaService.user.update({
            data: {
                password: hashedPassword,
            },
            where: { id },
        });

        return {
            isPasswordChanged: true,
        };
    }
}
