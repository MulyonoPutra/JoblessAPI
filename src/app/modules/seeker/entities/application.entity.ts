import { JobAdsEntity } from '../../employer/entities/job-ads.entity';

export class ApplicationEntity {
    jobAds: JobAdsEntity;
    id: string;
    status: string;
    date: Date;
}
