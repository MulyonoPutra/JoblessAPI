import { IsOptional, IsString } from 'class-validator';

export class SearchCompanyDto {
	@IsOptional()
	@IsString()
	query?: string;
}
