import { Employer } from '../../company/entities/company.entity';

export class JobAdsResponseEntity {
	id: string;
	title: string;
	description: string;
	requirements: string;
	salary: number;
	createdAt: string;
	employer: Employer;
}
