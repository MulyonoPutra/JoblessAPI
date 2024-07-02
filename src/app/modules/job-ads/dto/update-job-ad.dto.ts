import { PartialType } from '@nestjs/mapped-types';
import { CreateJobAdDto } from './create-job-ad.dto';

export class UpdateJobAdDto extends PartialType(CreateJobAdDto) {}
