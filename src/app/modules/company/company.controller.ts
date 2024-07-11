import { Controller, Get, Param, Query } from '@nestjs/common';
import { CompanyService } from './company.service';
import { SearchCompanyDto } from './dto/search-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  findAll(@Query() searchCompanyDto: SearchCompanyDto) {
    return this.companyService.findOrSearch(searchCompanyDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Get('jobs/:id')
  findJobByCompanyId(@Param('id') id: string) {
    return this.companyService.findJobAdsByCompanyId(id);
  }
}
