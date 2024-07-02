import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
} from '@nestjs/common';
import {
  CurrentUserId,
  EmployerDecorator,
  UploadLogoDecorator,
} from 'src/app/common/decorators';
import { CreateAddressDto } from './dto/create-address.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { CreateJobAdsDto } from './dto/create-job-ads.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { EmployerService } from './employer.service';

@Controller('employer')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @EmployerDecorator()
  @Post()
  create(
    @Body() createEmployerDto: CreateEmployerDto,
    @CurrentUserId() userId: string,
  ) {
    return this.employerService.create(createEmployerDto, userId);
  }

  @EmployerDecorator()
  @Get()
  findAll() {
    return this.employerService.findAll();
  }

  @EmployerDecorator()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employerService.findOne(id);
  }

  @EmployerDecorator()
  @Patch(':id')
  updateEmployer(
    @Body() updateEmployerDto: UpdateEmployerDto,
    @Param('id') seekerId: string,
  ) {
    return this.employerService.update(seekerId, updateEmployerDto);
  }

  @EmployerDecorator()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employerService.removeJobAds(id);
  }

  @EmployerDecorator()
  @Post('job-ads')
  createJobAds(@Body() createJobAdsDto: CreateJobAdsDto[]) {
    return this.employerService.createJobAds(createJobAdsDto);
  }

  @EmployerDecorator()
  @Post('company')
  createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.employerService.createCompany(createCompanyDto);
  }

  @EmployerDecorator()
  @Post('address')
  createAddress(@Body() createAddressDto: CreateAddressDto) {
    return this.employerService.createAddress(createAddressDto);
  }

  @UploadLogoDecorator()
  async upload(
    @Param('id') companyId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.employerService.uploadLogo(companyId, file);
  }

  @EmployerDecorator()
  @Get('job-ads')
  findAllJobAds() {
    return this.employerService.findAllJobAds();
  }
}
