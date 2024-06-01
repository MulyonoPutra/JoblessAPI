import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/app/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
