import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile } from '@nestjs/common';
import { CurrentUserId, EmployerDecorator, UploadLogoDecorator } from 'src/app/common/decorators';
import { CreateAddressDto } from './dto/create-address.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { CreateJobAdsDto } from './dto/create-job-ads.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { EmployerService } from './employer.service';
import { EmployerCreatedType } from './types/employer-created.type';
import { CompanyResponseType } from './types/company.response-type';
import { CreatedJobAdsType } from './types/created-job-ads.type';

@Controller('employer')
export class EmployerController {
    constructor(private readonly employerService: EmployerService) {}

    @EmployerDecorator()
    @Post()
    create(
        @Body() createEmployerDto: CreateEmployerDto,
        @CurrentUserId() userId: string,
    ): Promise<EmployerCreatedType> {
        return this.employerService.create(createEmployerDto, userId);
    }

    // TODO: Create Promise type
    @EmployerDecorator()
    @Get()
    findAll() {
        return this.employerService.findAll();
    }

    // TODO: Create Promise type
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
    ): Promise<void> {
        return this.employerService.update(seekerId, updateEmployerDto);
    }

    @EmployerDecorator()
    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.employerService.removeJobAds(id);
    }

    @EmployerDecorator()
    @Post('job-ads/:id')
    createJobAds(
        @Param('id') employerId: string,
        @Body() createJobAdsDto: CreateJobAdsDto,
    ): Promise<CreatedJobAdsType> {
        return this.employerService.createJobAds(employerId, createJobAdsDto);
    }

    @EmployerDecorator()
    @Post('company/:id')
    createCompany(
        @Param('id') employerId: string,
        @Body() createCompanyDto: CreateCompanyDto,
    ): Promise<CompanyResponseType> {
        return this.employerService.createCompany(employerId, createCompanyDto);
    }

    // TODO: Create Promise type
    @EmployerDecorator()
    @Post('address')
    createAddress(@Body() createAddressDto: CreateAddressDto) {
        return this.employerService.createAddress(createAddressDto);
    }

    // TODO: Create Promise type
    @UploadLogoDecorator()
    async upload(@Param('id') companyId: string, @UploadedFile() file: Express.Multer.File) {
        return await this.employerService.uploadLogo(companyId, file);
    }

    // TODO: Create Promise type
    @EmployerDecorator()
    @Get('job-ads')
    findAllJobAds() {
        return this.employerService.findAllJobAds();
    }
}
