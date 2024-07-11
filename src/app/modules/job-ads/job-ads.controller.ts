import { Controller, Get, Param, Query } from '@nestjs/common';

import { JobAdsService } from './job-ads.service';
import { SearchJobDto } from './dto/search-job.dto';

@Controller('job-ads')
export class JobAdsController {
  constructor(private readonly jobAdsService: JobAdsService) {}

  @Get()
  findAll(@Query() searchJobDto: SearchJobDto) {
    return this.jobAdsService.findOrSearch(searchJobDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobAdsService.findOne(id);
  }
}
