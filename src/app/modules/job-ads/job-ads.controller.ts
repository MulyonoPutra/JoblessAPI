import { Controller, Get, Param } from '@nestjs/common';

import { JobAdsService } from './job-ads.service';

@Controller('job-ads')
export class JobAdsController {
  constructor(private readonly jobAdsService: JobAdsService) {}

  @Get()
  findAll() {
    return this.jobAdsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobAdsService.findOne(id);
  }
}
