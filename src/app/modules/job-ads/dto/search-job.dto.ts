import { IsOptional, IsString } from 'class-validator';

export class SearchJobDto {
  @IsOptional()
  @IsString()
  query?: string;
}
