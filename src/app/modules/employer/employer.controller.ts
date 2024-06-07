import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EmployerService } from './employer.service';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { CurrentUserId } from 'src/app/common/decorators';
import { AuthenticationGuard } from 'src/app/common/guards/authentication.guard';
import { CreateJobAdsDto } from './dto/create-job-ads.dto';

@Controller('employer')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  create(
    @Body() createEmployerDto: CreateEmployerDto,
    @CurrentUserId() userId: string,
  ) {
    return this.employerService.create(createEmployerDto, userId);
  }

  @Get()
  findAll() {
    return this.employerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employerService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employerService.remove(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Post('job-ads')
  createJobAds(@Body() createJobAdsDto: CreateJobAdsDto[]) {
    return this.employerService.createJobAds(createJobAdsDto);
  }
}
