import * as cloudinary from 'cloudinary';

import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from 'src/app/prisma/prisma.service';
import { Profile } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';

import { compare, hash } from 'bcrypt';
import { ChangePasswordResponseType } from './types/change-password-response.type';

@Injectable()
export class ProfileService {
  constructor(private prismaService: PrismaService) {}

  async uploadAvatar(id: string, file: Express.Multer.File) {
    const result: cloudinary.UploadApiResponse =
      await cloudinary.v2.uploader.upload(file.path, {
        folder: 'nest',
      });
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
          statusCode: 200,
          message: 'Avatar Uploaded!',
        };
      }
    }

    throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
  }

  async findAll(): Promise<Profile[]> {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        phone: true,
        role: true,
        createdAt: true,
        seeker: true,
      },
    });
  }

  async findOne(id: string): Promise<Profile> {
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
        seeker: true,
      },
    });
  }

  async update(id: string, data: UpdateProfileDto): Promise<UpdateProfileDto> {
    return this.prismaService.user.update({
      data,
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        phone: true,
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

    const isCurrentPasswordValid: boolean = await compare(
      currentPassword,
      data.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException(
        'That is not your password! Please correct again.',
      );
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
