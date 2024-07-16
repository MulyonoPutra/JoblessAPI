import { EmployerEntity } from './employer.entity';

export class JobAdsEntity {
	id: string;
	title: string;
	description: string;
	requirements: string;
	workType: string;
	payType: string;
	salary: number;
	employer?: EmployerEntity;
}
