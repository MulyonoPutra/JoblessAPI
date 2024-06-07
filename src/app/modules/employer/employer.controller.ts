import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EmployerService } from './employer.service';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { CurrentUserId, Roles } from 'src/app/common/decorators';
import { AuthenticationGuard } from 'src/app/common/guards/authentication.guard';
import { CreateJobAdsDto } from './dto/create-job-ads.dto';
import { AuthorizationGuard } from 'src/app/common/guards/authorization.guard';
import { Role } from '../auth/enums/role.enum';

@Controller('employer')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Roles(Role.EMPLOYER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post()
  create(
    @Body() createEmployerDto: CreateEmployerDto,
    @CurrentUserId() userId: string,
  ) {
    return this.employerService.create(createEmployerDto, userId);
  }

  @Roles(Role.EMPLOYER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get()
  findAll() {
    return this.employerService.findAll();
  }

  @Roles(Role.EMPLOYER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employerService.findOne(id);
  }

  @Roles(Role.EMPLOYER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employerService.remove(+id);
  }

  @Roles(Role.EMPLOYER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Post('job-ads')
  createJobAds(@Body() createJobAdsDto: CreateJobAdsDto[]) {
    return this.employerService.createJobAds(createJobAdsDto);
  }
}
