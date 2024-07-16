import { JobAdsEntity } from '../../employer/entities/job-ads.entity';

export class Company {
    id: string;
    name: string;
    logo: string;
    header: string;
    website: string;
    industry: string;
    size: number;
    location: string;
    description: string;
    benefit: string;
    contactInfo: string;
    address: Address;
    employer: Employer;
}

export interface Address {
    id: string;
    street: string;
    province: string;
    regency: string;
    district: string;
    village: string;
    postCode: string;
    companyId: string;
}

export interface Employer {
    jobAds: JobAdsEntity[];
    company?: Company;
}
