import * as cloudinary from 'cloudinary';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/app/prisma/prisma.service';
import { Profile } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prismaService: PrismaService) {}

  async uploadAvatar(id: string, file: Express.Multer.File) {
    const result = await cloudinary.v2.uploader.upload(file.path, {
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
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string): Promise<Profile> {
    return await this.prismaService.user.findUnique({
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
      },
    });
  }

  async update(id: string, data: UpdateProfileDto): Promise<UpdateProfileDto> {
    return await this.prismaService.user.update({
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
    return await this.prismaService.user.delete({
      where: { id },
    });
  }
}
