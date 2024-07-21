import { Controller, Get, Param, Query } from '@nestjs/common';

import { JobAdsService } from './job-ads.service';
import { SearchJobDto } from './dto/search-job.dto';

@Controller('job-ads')
export class JobAdsController {
    constructor(private readonly jobAdsService: JobAdsService) {}

    // TODO: Create Promise type
    @Get()
    findAll(@Query() searchJobDto: SearchJobDto) {
        return this.jobAdsService.findOrSearch(searchJobDto);
    }

    // TODO: Create Promise type
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.jobAdsService.findOne(id);
    }
}
