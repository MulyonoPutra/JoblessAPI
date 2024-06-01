import { Injectable, NotFoundException } from '@nestjs/common';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.prismaService.category.create({
      data: createCategoryDto,
    });
  }

  async findAll(): Promise<Category[]> {
    return await this.prismaService.category.findMany();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.prismaService.category.findFirst({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException('Category is not found!');
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.prismaService.category.update({
      data: updateCategoryDto,
      where: { id },
    });
  }

  async remove(id: string): Promise<Category> {
    return await this.prismaService.category.delete({
      where: { id },
    });
  }
}
