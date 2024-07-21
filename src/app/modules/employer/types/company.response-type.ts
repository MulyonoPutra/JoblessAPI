export type CompanyResponseType = {
    name: string;
    logo?: string;
    website?: string;
    industry: string;
    size: number;
    location: string;
    description: string;
    benefit: string;
    contactInfo: string;

    employerId: string;
    createdAt: Date;
    updatedAt: Date;
};
