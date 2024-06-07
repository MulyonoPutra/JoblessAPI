import { EmployerEntity } from './employer.entity';

export class JobAdsEntity {
  id: string;
  title: string;
  description: string;
  requirements: string;
  salary: number;
  employer: EmployerEntity;
}
